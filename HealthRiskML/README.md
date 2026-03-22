# Health Risk Prediction Model

## Model Type
RandomForestClassifier

## Preprocessing Included
- StandardScaler (for numerical features)
- OneHotEncoder (for categorical features)
- All preprocessing steps are included inside the pipeline

## Features Used

### Numerical Features
- age
- height
- weight
- temperature
- blood_pressure
- heart_rate
- sleep
Important notes:

Height must be entered in centimeters

Weight must be in kilograms

Temperature must be in Celsius

Sleep must be hours per day

### Categorical Features
- gender
- smoking
- alcohol

Total Features: 10

## Input Format (JSON Example)

{
  "age": 35,
  "gender": "female",
  "weight": 70,
  "height": 172,
  "temperature": 38.2,
  "blood_pressure": 150,
  "heart_rate": 116,
  "sleep": 7,
  "smoking": "no",
  "alcohol": "yes"
}

## Output
The model returns one of the following health risk levels:

Low  
Medium  
High

Example response:

{
  "health_risk": "medium"
}

## Model File
The trained model is stored as:

model/health_risk_pipeline.pkl

This file contains:
- Data preprocessing
- Feature encoding
- Feature scaling
- Trained RandomForest model

## Usage
1. Load the model using joblib.
2. Convert input JSON into a dataframe.
3. Pass the data to the model pipeline.
4. Return the predicted health risk level.

