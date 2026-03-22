import joblib
import pandas as pd
import numpy as np
import os
from django.conf import settings

MODEL_PATH = "C:\\Users\\18080\\OOSE\\HealthRiskML\\model\\health_risk_pipeline.pkl"
_model = None

def get_model():
    """Load model lazily"""
    global _model
    if _model is None:
        try:
            print(f"Loading model from: {MODEL_PATH}")
            _model = joblib.load(MODEL_PATH)
            print("✅ Model loaded successfully")
            print(f"Model type: {type(_model)}")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            _model = None
    return _model

def predict_health_risk(data):
    """
    Make prediction using the loaded model
    """
    model = get_model()
    if model is None:
        raise Exception("Model not loaded")
    
    try:
        # Create DataFrame with EXACT format your model expects
        sample_data = pd.DataFrame([{
            "age": int(data["age"]),
            "gender": str(data["gender"]).lower().strip(),
            "weight": float(data["weight"]),
            "height": float(data["height"]),
            "temperature": float(data["temperature"]),
            "blood_pressure": float(data["blood_pressure"]),
            "sleep": float(data["sleep"]),
            "heart_rate": int(data["heart_rate"]),
            "smoking": str(data["smoking"]).lower().strip(),
            "alcohol": str(data["alcohol"]).lower().strip()
        }])
        
        print("="*50)
        print("Input data for prediction:")
        print(sample_data)
        print("="*50)
        
        # Make prediction
        prediction = model.predict(sample_data)
        print(f"Raw prediction: {prediction}")
        print(f"Prediction type: {type(prediction)}")
        
        # Extract prediction value - handle both string and numeric predictions
        if isinstance(prediction, (list, tuple, np.ndarray)):
            pred_value = prediction[0] if len(prediction) > 0 else prediction
        else:
            pred_value = prediction
        
        print(f"Extracted value: {pred_value}, Type: {type(pred_value)}")
        
        # CASE 1: If prediction is already a string like 'low', 'medium', 'high'
        if isinstance(pred_value, str):
            risk_level = pred_value.lower().strip()
            risk_score = None  # No numeric score for string predictions
            
            # Validate it's one of expected values
            if risk_level not in ['low', 'medium', 'high']:
                risk_level = 'medium'  # Default
                
        # CASE 2: If prediction is numeric (0, 1, 2)
        elif isinstance(pred_value, (int, float, np.integer, np.floating)):
            pred_float = float(pred_value)
            
            # Map numeric to risk level
            if pred_float in [0, 1, 2]:
                risk_map = {0: "low", 1: "medium", 2: "high"}
                risk_level = risk_map.get(int(pred_float), "medium")
            elif pred_float < 0.5:
                risk_level = "low"
            elif pred_float < 1.5:
                risk_level = "medium"
            else:
                risk_level = "high"
            
            risk_score = pred_float
            
        # CASE 3: If prediction is something else
        else:
            risk_level = "medium"
            risk_score = None
            print(f"Unexpected prediction type: {type(pred_value)}")
        
        result = {
            "risk_level": risk_level,
        }
        
        # Only include risk_score if it exists
        if risk_score is not None:
            result["risk_score"] = risk_score
        
        # Get probability if available
        if hasattr(model, "predict_proba"):
            try:
                proba = model.predict_proba(sample_data)[0]
                print(f"Probability scores: {proba}")
                
                if len(proba) == 3:
                    result["probability"] = {
                        "low": float(proba[0]),
                        "medium": float(proba[1]),
                        "high": float(proba[2])
                    }
            except Exception as e:
                print(f"Could not get probabilities: {e}")
        
        print(f"Final result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Prediction failed: {str(e)}")
def generate_prescription(risk_level, data):
    """
    Generate prescription based on risk level and patient data
    """
    prescriptions = {
        "low": (
            "✅ LOW RISK DETECTED\n"
            "• Maintain current healthy lifestyle\n"
            "• Regular exercise (30 minutes daily)\n"
            "• Balanced diet with fruits and vegetables\n"
            "• Annual health checkup recommended\n"
            "• Stay hydrated and get adequate sleep"
        ),
        
        "medium": (
            "⚠️ MEDIUM RISK DETECTED\n"
            "• Schedule a consultation with your physician\n"
            "• Consider lifestyle modifications:\n"
            "  - Reduce sugar and salt intake\n"
            "  - Increase physical activity\n"
            "  - Maintain healthy weight\n"
            "• Monitor blood pressure regularly\n"
            "• Follow up in 3 months"
        ),
        
        "high": (
            "🚨 HIGH RISK DETECTED - IMMEDIATE ATTENTION REQUIRED\n"
            "• Please book an appointment with a specialist immediately\n"
            "• Avoid smoking and alcohol consumption\n"
            "• Monitor vital signs daily\n"
            "• Follow prescribed medications strictly\n"
            "• Emergency contact: Keep doctor's number handy"
        )
    }
    
    # Customize based on specific health parameters
    custom_advice = []
    
    # BMI calculation
    height_m = data.get('height', 170) / 100
    weight = data.get('weight', 70)
    bmi = weight / (height_m * height_m)
    
    if bmi < 18.5:
        custom_advice.append("• You are underweight. Consider nutritional counseling")
    elif bmi > 25:
        custom_advice.append("• You are overweight. Consider weight management program")
    
    # Blood pressure advice
    bp = data.get('blood_pressure', 120)
    if bp > 140:
        custom_advice.append("• Blood pressure is high. Monitor regularly")
    elif bp < 90:
        custom_advice.append("• Blood pressure is low. Stay hydrated")
    
    # Sleep advice
    sleep = data.get('sleep', 7)
    if sleep < 6:
        custom_advice.append("• Sleep duration is low. Aim for 7-8 hours")
    elif sleep > 9:
        custom_advice.append("• Excessive sleep. Consult if feeling tired")
    
    # Heart rate advice
    hr = data.get('heart_rate', 70)
    if hr > 100:
        custom_advice.append("• Elevated heart rate. Avoid stimulants")
    elif hr < 60:
        custom_advice.append("• Low heart rate. Common in athletes, but consult if symptomatic")
    
    # Combine standard prescription with custom advice
    base_prescription = prescriptions.get(risk_level, prescriptions['medium'])
    
    if custom_advice and risk_level != 'high':
        full_prescription = base_prescription + "\n\nAdditional Recommendations:\n" + "\n".join(custom_advice)
    else:
        full_prescription = base_prescription
    
    return full_prescription