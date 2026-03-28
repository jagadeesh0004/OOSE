# 🧠 Health Predictions API Documentation

## Overview
The Health Predictions API provides AI/ML-based health risk prediction based on patient health metrics. It analyzes health data and provides risk assessment along with personalized prescriptions and doctor recommendations.

---

## 🔌 Base URL
```
/api/predictions/
```

---

## 📋 API Endpoints

### 1. **Make Health Prediction**
**Predict health risk using ML model (Patient only)**

- **Endpoint:** `POST /predict/`
- **Permission:** `IsAuthenticated` (Patient only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
```json
{
  "age": 35,
  "gender": "male",
  "weight": 75.5,
  "height": 180,
  "temperature": 37.0,
  "blood_pressure": 120,
  "sleep": 7,
  "heart_rate": 72,
  "smoking": "yes",
  "alcohol": "no"
}
```

#### Response (201 Created)
```json
{
  "risk_level": "low",
  "prescription": "Stay hydrated, maintain regular exercise, balanced diet, adequate sleep",
  "message": "Health prediction completed successfully"
}
```

#### Response (201 Created) - High Risk with Doctor Recommendation
```json
{
  "risk_level": "high",
  "prescription": "Immediate medical consultation required. Monitor blood pressure daily. Reduce salt and fat intake. Avoid smoking and alcohol. Schedule regular doctor visits.",
  "message": "Health prediction completed successfully",
  "recommended_doctor": {
    "id": 1,
    "name": "Dr. John Smith",
    "specialization": "Cardiology",
    "hospital": "City Hospital",
    "fee": "500.00"
  }
}
```

#### Error Responses
- **403 Forbidden:** User is not a patient
  ```json
  {
    "error": "Only patients can make predictions"
  }
  ```
- **400 Bad Request:** Invalid input data
  ```json
  {
    "age": ["Ensure this value is greater than or equal to 1."],
    "weight": ["Ensure this value is greater than or equal to 20."]
  }
  ```
- **500 Internal Server Error:** Prediction failed
  ```json
  {
    "error": "Prediction failed: <error_details>"
  }
  ```

#### Input Validations

| Field | Type | Valid Range | Description |
|-------|------|-------------|-------------|
| `age` | Integer | 1-120 | Age in years |
| `gender` | Choice | male/female | Biological gender |
| `weight` | Float | 20-300 | Weight in kilograms |
| `height` | Float | 50-250 | Height in centimeters |
| `temperature` | Float | 35-42 | Body temperature in Celsius |
| `blood_pressure` | Float | 50-250 | Systolic blood pressure (mmHg) |
| `sleep` | Float | 0-24 | Sleep hours per day |
| `heart_rate` | Integer | 30-200 | Heart rate in beats per minute |
| `smoking` | Choice | yes/no | Smoking status |
| `alcohol` | Choice | yes/no | Alcohol consumption status |

#### Risk Level Classification

| Risk Level | Description | Action |
|-----------|-------------|--------|
| **low** | Low health risk | Maintain current lifestyle, regular checkups |
| **medium** | Moderate health risk | Monitor health metrics, lifestyle changes |
| **high** | High health risk | Immediate consultation recommended, medication may be needed |

#### Prescription Examples

**Low Risk:**
```
Stay hydrated, maintain regular exercise, balanced diet, adequate sleep
```

**Medium Risk:**
```
Monitor blood pressure regularly, reduce salt and fat intake, exercise 30 mins daily, adequate sleep (7-8 hours), stress management
```

**High Risk:**
```
Immediate medical consultation required. Monitor blood pressure daily. Reduce salt and fat intake. Avoid smoking and alcohol. Schedule regular doctor visits.
```

#### Workflow
1. Patient provides health metrics
2. ML model analyzes the data
3. Risk level is calculated
4. Prescription is generated based on risk level
5. For high-risk patients, a recommended doctor is provided
6. Prediction is stored in database for history

---

### 2. **Get Prediction History**
**Retrieve all past predictions for the logged-in patient**

- **Endpoint:** `GET /history/`
- **Permission:** `IsAuthenticated` (Patient only)
- **Authentication Header:** `Authorization: Token <token>`

#### Query Parameters (Optional)
```
?risk_level=high&ordering=-created_at&limit=20&offset=0
```

#### Request
```
GET /history/?risk_level=high
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user": 10,
    "age": 35,
    "gender": "male",
    "weight": 75.5,
    "height": 180,
    "temperature": 37.0,
    "blood_pressure": "120/80",
    "sleep": 7,
    "heart_rate": 72,
    "smoking": false,
    "alcohol": false,
    "risk_level": "low",
    "risk_score": 0.25,
    "prescription": "Stay hydrated, maintain regular exercise, balanced diet, adequate sleep",
    "created_at": "2026-03-20T10:30:45Z"
  },
  {
    "id": 2,
    "user": 10,
    "age": 35,
    "gender": "male",
    "weight": 76.0,
    "height": 180,
    "temperature": 37.5,
    "blood_pressure": "135/85",
    "sleep": 6,
    "heart_rate": 85,
    "smoking": true,
    "alcohol": false,
    "risk_level": "medium",
    "risk_score": 0.55,
    "prescription": "Monitor blood pressure regularly, reduce salt and fat intake, exercise 30 mins daily",
    "created_at": "2026-03-18T14:22:10Z"
  },
  {
    "id": 3,
    "user": 10,
    "age": 35,
    "gender": "male",
    "weight": 78.0,
    "height": 180,
    "temperature": 38.5,
    "blood_pressure": "160/100",
    "sleep": 5,
    "heart_rate": 95,
    "smoking": true,
    "alcohol": true,
    "risk_level": "high",
    "risk_score": 0.85,
    "prescription": "Immediate medical consultation required. Monitor blood pressure daily...",
    "created_at": "2026-03-15T09:15:22Z"
  }
]
```

#### Response Filtering
- Filter by `risk_level`: low, medium, high
- Sort by `created_at`: ascending/descending
- Pagination with `limit` and `offset`

#### Error Responses
- **401 Unauthorized:** Missing or invalid token

---

### 3. **Get Prediction Details**
**Retrieve details of a specific prediction**

- **Endpoint:** `GET /<id>/`
- **Permission:** `IsAuthenticated` (Patient only)
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /1/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user": 10,
  "age": 35,
  "gender": "male",
  "weight": 75.5,
  "height": 180,
  "temperature": 37.0,
  "blood_pressure": "120/80",
  "sleep": 7,
  "heart_rate": 72,
  "smoking": false,
  "alcohol": false,
  "risk_level": "low",
  "risk_score": 0.25,
  "prescription": "Stay hydrated, maintain regular exercise, balanced diet, adequate sleep",
  "created_at": "2026-03-20T10:30:45Z"
}
```

#### Error Responses
- **404 Not Found:** Prediction not found
  ```json
  {
    "detail": "Not found."
  }
  ```
- **403 Forbidden:** Patient can only view their own predictions
  ```json
  {
    "error": "You do not have permission to view this prediction"
  }
  ```

---

## 📊 Data Models

### HealthPrediction Model
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Prediction ID |
| `user` | ForeignKey | Yes | Patient reference |
| `age` | Integer | Yes | Age in years |
| `gender` | String | Yes | male/female |
| `weight` | Float | Yes | Weight in kg |
| `height` | Float | Yes | Height in cm |
| `temperature` | Float | Yes | Body temp in °C |
| `blood_pressure` | String | Yes | BP reading (e.g., "120/80") |
| `sleep` | Float | Yes | Sleep hours per day |
| `heart_rate` | Integer | Yes | Heart rate in bpm |
| `smoking` | Boolean | Yes | Smoking status |
| `alcohol` | Boolean | Yes | Alcohol consumption |
| `risk_level` | Choice | Auto | low/medium/high |
| `risk_score` | Float | No | Prediction probability (0-1) |
| `prescription` | TextField | No | Personalized recommendations |
| `created_at` | DateTime | Auto | Prediction creation time |

---

## 🤖 ML Model Features

### Input Features (10 total)
1. **Age** - Patient's age
2. **Gender** - Biological sex
3. **Weight** - Body weight
4. **Height** - Body height (calculates BMI)
5. **Temperature** - Body temperature
6. **Blood Pressure** - Systolic pressure
7. **Sleep** - Hours of sleep
8. **Heart Rate** - Resting heart rate
9. **Smoking** - Smoking status
10. **Alcohol** - Alcohol consumption

### Output
- **Risk Level**: Classification (low/medium/high)
- **Risk Score**: Probability score (0-1)

### Model Type
- Uses scikit-learn for prediction
- Trained on health datasets
- Provides personalized recommendations

---

## 📋 Health Metrics Guide

### Age
- **Valid Range:** 1-120 years
- **Best Practice:** Include date of birth if available

### Weight & Height
- **Weight Range:** 20-300 kg
- **Height Range:** 50-250 cm
- **Note:** Used to calculate BMI

### Temperature
- **Valid Range:** 35-42°C
- **Normal:** 36.5-37.5°C
- **Fever:** > 38.5°C

### Blood Pressure
- **Valid Range:** 50-250 mmHg (systolic)
- **Normal:** < 120 mmHg
- **Elevated:** 120-129 mmHg
- **High:** > 130 mmHg

### Heart Rate
- **Valid Range:** 30-200 bpm
- **Normal:** 60-100 bpm (resting)
- **Elevated:** > 100 bpm

### Sleep
- **Valid Range:** 0-24 hours
- **Recommended:** 7-9 hours

---

## 📝 Example Usage (cURL)

### Make Prediction
```bash
curl -X POST http://localhost:8000/api/predictions/predict/ \
  -H "Authorization: Token abc123token456" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "gender": "male",
    "weight": 75.5,
    "height": 180,
    "temperature": 37.0,
    "blood_pressure": 120,
    "sleep": 7,
    "heart_rate": 72,
    "smoking": "yes",
    "alcohol": "no"
  }'
```

### Get Prediction History
```bash
curl -X GET http://localhost:8000/api/predictions/history/ \
  -H "Authorization: Token abc123token456"
```

### Get Specific Prediction
```bash
curl -X GET http://localhost:8000/api/predictions/1/ \
  -H "Authorization: Token abc123token456"
```

### Filter History by Risk Level
```bash
curl -X GET "http://localhost:8000/api/predictions/history/?risk_level=high" \
  -H "Authorization: Token abc123token456"
```

---

## 🔄 Prediction Workflow

```
1. Patient Submits Health Data
   ↓
2. System Validates Input
   ↓
3. ML Model Makes Prediction
   ├─ Analyzes 10 health metrics
   ├─ Calculates risk score
   └─ Determines risk level
   
4. Generate Prescription
   ├─ Risk-based recommendations
   └─ Lifestyle suggestions
   
5. Check Risk Level
   ├─ If High Risk: Recommend doctor
   └─ Always: Store for history
   
6. Return Result to Patient
   ├─ Risk assessment
   ├─ Prescription
   └─ Doctor recommendation (if needed)
```

---

## ⚠️ Risk Assessment Guide

### Low Risk (Score 0-0.33)
✅ **What to do:**
- Maintain current healthy lifestyle
- Continue regular exercise
- Balanced nutrition
- Regular checkups annually

### Medium Risk (Score 0.34-0.66)
⚠️ **Action Items:**
- Monitor health metrics regularly
- Implement lifestyle changes
- Reduce salt and fat intake
- Regular exercise (30 min daily)
- Stress management
- Medical checkup in 3 months

### High Risk (Score 0.67-1.0)
🚨 **Urgent Actions:**
- **Schedule immediate doctor consultation**
- Daily health monitoring
- Medication may be required
- Strict dietary changes
- Avoid smoking and alcohol
- Regular follow-ups

---

## 💡 Key Features

✅ **ML-Based Assessment** - Scikit-learn prediction model  
✅ **Personalized Prescriptions** - Risk-based recommendations  
✅ **Doctor Recommendations** - Auto-connect high-risk patients  
✅ **History Tracking** - All predictions stored for monitoring  
✅ **Real-time Analysis** - Instant health risk assessment  
✅ **Risk Score** - Probability-based confidence measure  

---

## ⚠️ Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 403 | Only patients can make predictions | Ensure user is registered as patient |
| 400 | Invalid input data | Check all fields are within valid ranges |
| 400 | Age must be 1-120 | Provide valid age |
| 400 | Weight must be 20-300 | Provide valid weight |
| 400 | Temperature must be 35-42 | Check temperature reading |
| 401 | Credentials not provided | Include Authorization header |
| 404 | Prediction not found | Verify prediction ID |

---

## 📊 Sample Prediction Scenarios

### Scenario 1: Healthy Patient
```json
{
  "age": 28,
  "gender": "female",
  "weight": 60,
  "height": 165,
  "temperature": 37.0,
  "blood_pressure": 110,
  "sleep": 8,
  "heart_rate": 65,
  "smoking": "no",
  "alcohol": "no"
}
Result: LOW RISK - 0.15 score
```

### Scenario 2: At-Risk Patient
```json
{
  "age": 45,
  "gender": "male",
  "weight": 85,
  "height": 175,
  "temperature": 37.5,
  "blood_pressure": 140,
  "sleep": 5,
  "heart_rate": 88,
  "smoking": "yes",
  "alcohol": "yes"
}
Result: HIGH RISK - 0.78 score
Recommendation: See Cardiologist
```

---

## 🔐 Data Privacy

- ✅ All predictions linked to authenticated user
- ✅ Each user only sees their own predictions
- ✅ No data sharing between users
- ✅ Secure health information storage

---
