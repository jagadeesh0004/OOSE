import joblib
import pandas as pd

# Load model
model = joblib.load("model/health_risk_pipeline.pkl")

# Sample input
sample_data = pd.DataFrame([{
    "age" : 35,
    "gender" : "female",
    "weight" : 78,
    "height" : 172,
    "temperature" :38.2,
    "blood_pressure" :150,
    "sleep" : 7,
    "heart_rate" :116,
    "smoking" : "no",
    "alcohol" : "yes"
}])

prediction = model.predict(sample_data)

print("Predicted Health Risk:", prediction[0])