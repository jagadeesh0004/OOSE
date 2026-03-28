# 🚀 API Quick Start & Testing Guide

## 📖 Quick Start

This guide provides a quick overview and testing examples for all Health Predictor APIs.

---

## 1️⃣ Setup & Configuration

### Prerequisites
- Django server running on `http://localhost:8000`
- Python/cURL or Postman installed for API testing
- Understanding of REST API concepts

### Initialize Server
```bash
# Navigate to project
cd Health_Predictor/health_predictor

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

---

## 2️⃣ Complete User Journey Examples

### 🎯 Example: Complete Patient Journey

#### Step 1: Register as Patient
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient_john",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "+1234567890"
  }'
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "patient_john",
    "email": "john@example.com",
    "user_type": "patient"
  },
  "token": "1234567890abcdef",
  "message": "User created successfully"
}
```

Save the token: `TOKEN_PATIENT="1234567890abcdef"`

---

#### Step 2: View Available Doctors
```bash
curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token 1234567890abcdef" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 1,
    "user": {
      "username": "dr_smith",
      "first_name": "Smith",
      "phone_number": "+0987654321"
    },
    "specialization": "Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "hospital_name": "City Hospital"
  }
]
```

---

#### Step 3: Check Doctor's Available Slots
```bash
curl -X GET "http://localhost:8000/api/doctors/1/available-slots/?date=2026-03-25" \
  -H "Authorization: Token 1234567890abcdef" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 101,
    "doctor": 1,
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:00:00",
    "end_time": "09:15:00",
    "slot_number": 1,
    "is_booked": false
  },
  {
    "id": 102,
    "doctor": 1,
    "date": "2026-03-25",
    "start_time": "09:15:00",
    "end_time": "09:30:00",
    "slot_number": 2,
    "is_booked": false
  }
]
```

---

#### Step 4: Book Appointment
```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token 1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "date": "2026-03-25",
    "slot_number": 1,
    "symptoms": "Chest pain and high blood pressure"
  }'
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 501,
    "doctor": "Dr. John Smith",
    "specialization": "Cardiology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:00:00",
    "end_time": "09:15:00",
    "slot_number": 1,
    "symptoms": "Chest pain and high blood pressure",
    "status": "pending"
  }
}
```

---

#### Step 5: Get Your Appointments
```bash
curl -X GET http://localhost:8000/api/appointments/my-appointments/ \
  -H "Authorization: Token 1234567890abcdef" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 501,
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "appointment_date": "2026-03-25",
    "appointment_time": "09:00:00 - 09:15:00",
    "status": "pending",
    "symptoms": "Chest pain and high blood pressure",
    "created_at": "2026-03-20T10:30:45Z"
  }
]
```

---

#### Step 6: Make Health Prediction
```bash
curl -X POST http://localhost:8000/api/predictions/predict/ \
  -H "Authorization: Token 1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "gender": "male",
    "weight": 75.5,
    "height": 180,
    "temperature": 37.0,
    "blood_pressure": 130,
    "sleep": 6,
    "heart_rate": 85,
    "smoking": "yes",
    "alcohol": "no"
  }'
```

**Response:**
```json
{
  "risk_level": "medium",
  "prescription": "Monitor blood pressure regularly, reduce salt and fat intake, exercise 30 mins daily, adequate sleep (7-8 hours)",
  "message": "Health prediction completed successfully"
}
```

---

#### Step 7: View Prediction History
```bash
curl -X GET http://localhost:8000/api/predictions/history/ \
  -H "Authorization: Token 1234567890abcdef" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 1,
    "age": 35,
    "gender": "male",
    "weight": 75.5,
    "height": 180,
    "blood_pressure": "130",
    "heart_rate": 85,
    "smoking": true,
    "alcohol": false,
    "risk_level": "medium",
    "risk_score": 0.52,
    "prescription": "Monitor blood pressure regularly...",
    "created_at": "2026-03-20T10:30:45Z"
  }
]
```

---

### 🏥 Example: Complete Doctor Journey

#### Step 1: Register as Doctor
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_smith",
    "email": "smith@hospital.com",
    "password": "DoctorPass123!",
    "password2": "DoctorPass123!",
    "first_name": "Smith",
    "last_name": "Johnson",
    "user_type": "doctor",
    "phone_number": "+0987654321"
  }'
```

Save the token: `TOKEN_DOCTOR="doctor_token_here"`

---

#### Step 2: Create Doctor Profile
```bash
curl -X POST http://localhost:8000/api/doctors/create-profile/ \
  -H "Authorization: Token doctor_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Cardiology",
    "qualification": "MD in Cardiology from Harvard Medical",
    "experience_years": 12,
    "consultation_fee": 500.00,
    "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "time_slots": [
      {"start": "09:00", "end": "12:00"},
      {"start": "14:00", "end": "17:00"}
    ],
    "consultation_duration": 30,
    "slot_duration": 15,
    "hospital_name": "City Medical Center",
    "hospital_address": "123 Main Street, Downtown"
  }'
```

**Response:**
```json
{
  "message": "Doctor profile created successfully",
  "doctor_profile": {
    "id": 1,
    "specialization": "Cardiology",
    "experience_years": 12,
    "consultation_fee": "500.00",
    "hospital_name": "City Medical Center"
  }
}
```

---

#### Step 3: Generate Time Slots
```bash
curl -X POST http://localhost:8000/api/doctors/generate-slots/ \
  -H "Authorization: Token doctor_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-03-25",
    "end_date": "2026-03-31",
    "time_slots": [
      {"start": "09:00", "end": "12:00"},
      {"start": "14:00", "end": "17:00"}
    ],
    "days_to_generate": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }'
```

**Response:**
```json
{
  "message": "Time slots generated successfully",
  "generated_slots_count": 48,
  "slots": [...]
}
```

---

#### Step 4: Check Your Slots
```bash
curl -X GET http://localhost:8000/api/doctors/my-slots/ \
  -H "Authorization: Token doctor_token_here" \
  -H "Content-Type: application/json"
```

---

#### Step 5: View Today's Appointments
```bash
curl -X GET http://localhost:8000/api/appointments/doctor/today/ \
  -H "Authorization: Token doctor_token_here" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 501,
    "patient_details": {
      "username": "patient_john",
      "phone_number": "+1234567890"
    },
    "appointment_date": "2026-03-20",
    "appointment_time": "10:00:00 - 10:15:00",
    "status": "pending",
    "symptoms": "Chest pain and high blood pressure"
  }
]
```

---

#### Step 6: Update Appointment Status
```bash
curl -X PATCH http://localhost:8000/api/appointments/doctor/update-status/501/ \
  -H "Authorization: Token doctor_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Patient has hypertension. Prescribed ACE inhibitor. Follow-up in 2 weeks."
  }'
```

**Response:**
```json
{
  "id": 501,
  "status": "confirmed",
  "notes": "Patient has hypertension. Prescribed ACE inhibitor. Follow-up in 2 weeks.",
  "updated_at": "2026-03-20T14:30:00Z"
}
```

---

## 3️⃣ Testing with Postman

### Import Collection

1. Open Postman
2. Create new collection "Health Predictor API"
3. Add requests manually or import JSON

### Sample Postman Environment Variables
```json
{
  "baseUrl": "http://localhost:8000/api",
  "patientToken": "patient_token_here",
  "doctorToken": "doctor_token_here",
  "doctorId": 1,
  "appointmentId": 501,
  "predictionId": 1
}
```

### Request Examples

#### GET Request
```
Method: GET
URL: {{baseUrl}}/accounts/profile/
Headers:
  - Authorization: Token {{patientToken}}
  - Content-Type: application/json
```

#### POST Request
```
Method: POST
URL: {{baseUrl}}/appointments/book/
Headers:
  - Authorization: Token {{patientToken}}
  - Content-Type: application/json
Body (raw JSON):
{
  "doctor_id": {{doctorId}},
  "date": "2026-03-25",
  "slot_number": 1,
  "symptoms": "Chest pain"
}
```

---

## 4️⃣ Test Scenarios

### Scenario 1: Successful Appointment Booking
```
✅ Register Patient
✅ Login (get token)
✅ Browse Doctors
✅ View Available Slots
✅ Book Appointment
✅ Verify Appointment Created
```

### Scenario 2: Error Handling
```
❌ Try to book past date → Error: "Cannot book appointments for past dates"
❌ Try to double-book → Error: "You already have an appointment at this time"
❌ Try to book without token → Error: "Authentication credentials were not provided"
```

### Scenario 3: Doctor Workflow
```
✅ Register Doctor
✅ Create Doctor Profile
✅ Generate Time Slots
✅ View Appointments
✅ Update Appointment Status
✅ Add Clinical Notes
```

### Scenario 4: Health Prediction
```
✅ Enter Health Metrics
✅ Get Risk Assessment
✅ View Prescription
✅ Check Recommendation (if high-risk)
✅ View Prediction History
```

---

## 5️⃣ Common Testing Patterns

### Pattern 1: Authentication Flow
```bash
# Register
TOKEN=$(curl -s -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Pass123!","password2":"Pass123!",...}' \
  | jq -r '.token')

# Use token in next request
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token $TOKEN"
```

### Pattern 2: Chain Requests
```bash
# Get doctor ID
DOCTOR_ID=$(curl -s -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token $TOKEN" \
  | jq -r '.[0].id')

# Use doctor ID to get slots
curl -X GET http://localhost:8000/api/doctors/$DOCTOR_ID/available-slots/ \
  -H "Authorization: Token $TOKEN"
```

### Pattern 3: Error Handling
```bash
# Check for errors in response
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}' | jq '.error // .message'
```

---

## 6️⃣ Performance Testing

### Load Testing Commands
```bash
# Test endpoint with concurrent requests (using Apache Bench)
ab -n 100 -c 10 -H "Authorization: Token $TOKEN" \
  http://localhost:8000/api/doctors/list/
```

### Monitoring Response Times
```bash
# Check response time
time curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token $TOKEN"
```

---

## 7️⃣ Debugging Tips

### 1. Enable Django Debug Mode
```python
# settings.py
DEBUG = True
```

### 2. Check Server Logs
```bash
# In terminal running Django server
# Watch for error messages
```

### 3. Verify Database
```bash
# Check if data is saved
python manage.py dbshell
SELECT * FROM appointments_appointment;
```

### 4. Test Token Validity
```bash
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token invalid_token" \
  -H "Content-Type: application/json"
# Should return 401 Unauthorized
```

### 5. Inspect Request/Response
```bash
# Add -v flag for verbose output
curl -v -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 8️⃣ Validation Testing

### Test Input Validation
```bash
# Invalid age (out of range)
curl -X POST http://localhost:8000/api/predictions/predict/ \
  -H "Authorization: Token $TOKEN" \
  -d '{"age": 150, ...}'
# Response: {"age": ["Ensure this value is less than or equal to 120."]}

# Missing required field
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token $TOKEN" \
  -d '{"doctor_id": 1, "date": "2026-03-25"}'
# Response: {"slot_number": ["This field is required."]}

# Invalid date format
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token $TOKEN" \
  -d '{"date": "invalid-date", ...}'
```

---

## 9️⃣ Endpoint Coverage Checklist

### Accounts API
- [ ] POST /register/ - Create user
- [ ] POST /login/ - Authenticate
- [ ] GET /profile/ - Get profile
- [ ] PUT /profile/ - Update profile
- [ ] POST /logout/ - Logout

### Doctors API
- [ ] POST /create-profile/ - Create doctor profile
- [ ] GET /check-profile/ - Check profile
- [ ] GET /my-profile/ - Get profile
- [ ] PUT /update-profile/ - Update profile
- [ ] POST /generate-slots/ - Generate slots
- [ ] GET /my-slots/ - Get slots
- [ ] POST /add-slot/ - Add slot
- [ ] DELETE /delete-slot/{id}/ - Delete slot
- [ ] GET /list/ - List doctors
- [ ] GET /{id}/ - Get doctor details
- [ ] GET /{doctor_id}/available-slots/ - Get available slots

### Appointments API
- [ ] POST /book/ - Book appointment
- [ ] GET /my-appointments/ - Get patient appointments
- [ ] DELETE /cancel/{id}/ - Cancel appointment
- [ ] GET /doctor/appointments/ - Get doctor appointments
- [ ] GET /doctor/today/ - Get today's appointments
- [ ] PATCH /doctor/update-status/{id}/ - Update status
- [ ] GET /upcoming/ - Get upcoming appointments
- [ ] GET /{id}/ - Get appointment details
- [ ] GET /check-slot/{slot_id}/ - Check slot availability

### Predictions API
- [ ] POST /predict/ - Make prediction
- [ ] GET /history/ - Get prediction history
- [ ] GET /{id}/ - Get prediction details

---

## 🔟 Advanced Testing

### Test Database Transactions
```bash
# Verify appointment and slot state
curl -X GET http://localhost:8000/api/appointments/check-slot/101/ \
  -H "Authorization: Token $TOKEN"
# Should show is_booked: true after booking
```

### Test Cascading Operations
```bash
# After canceling appointment, slot should be unbooked
curl -X DELETE http://localhost:8000/api/appointments/cancel/501/ \
  -H "Authorization: Token $TOKEN"

# Verify slot is unbooked
curl -X GET http://localhost:8000/api/appointments/check-slot/101/ \
  -H "Authorization: Token $TOKEN"
# Should show is_booked: false
```

---

## 📊 Test Results Template

```markdown
## Test Run: [Date]

### Accounts API
- Register: ✅ PASS
- Login: ✅ PASS
- Get Profile: ✅ PASS
- Update Profile: ✅ PASS
- Logout: ✅ PASS

### Doctors API
- Create Profile: ✅ PASS
- Generate Slots: ✅ PASS
- List Doctors: ✅ PASS
- Get Available Slots: ✅ PASS

### Appointments API
- Book Appointment: ✅ PASS
- Get Appointments: ✅ PASS
- Cancel Appointment: ✅ PASS
- Update Status: ✅ PASS

### Predictions API
- Make Prediction: ✅ PASS
- Get History: ✅ PASS
- Get Details: ✅ PASS

### Performance
- Average Response Time: XXX ms
- Max Response Time: XXX ms
- Errors: 0

### Overall Result: ✅ ALL TESTS PASSED
```

---

## 📞 Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Include token in Authorization header |
| 403 Forbidden | Check user role (patient/doctor) |
| 404 Not Found | Verify resource ID exists |
| 400 Bad Request | Validate input data types and formats |
| Connect Refused | Check if Django server is running |
| CORS Error | Ensure headers are correct |

---

This quick start guide provides everything needed to test and understand all Health Predictor APIs. Refer to individual API documentation for detailed information.

---
