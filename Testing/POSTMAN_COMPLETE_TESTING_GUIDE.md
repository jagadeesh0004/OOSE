# 🚀 Complete Postman Testing Guide - Health Predictor API

## 📋 Table of Contents
1. [Setup & Configuration](#setup--configuration)
2. [Environment Variables](#environment-variables)
3. [Authentication Flow](#authentication-flow)
4. [Complete End-to-End Test Scenarios](#complete-end-to-end-test-scenarios)
5. [API Endpoint Testing](#api-endpoint-testing)
6. [Error Handling & Troubleshooting](#error-handling--troubleshooting)

---

## Setup & Configuration

### Prerequisites
- Backend server running on `http://localhost:8000`
- Postman installed (free version available at postman.com)
- Chrome Postman extension or Desktop app

### Step 1: Create Postman Workspace
1. Open Postman
2. Create New → Select "Workspace"
3. Name it: `Health_Predictor_Testing`
4. Create the workspace

### Step 2: Create Postman Collection
1. Create New → Select "Collection"
2. Name it: `Health Predictor API`
3. Add description: "Complete API testing for Health Predictor Application"

### Step 3: Create Environment
1. Go to Environments (left sidebar)
2. Create New → Environment
3. Name it: `Local_Development`
4. Add the following variables (see [Environment Variables](#environment-variables) section)

---

## Environment Variables

### Add These Variables to Your Postman Environment

Create variables that will be reused across all requests:

| Variable | Initial Value | Current Value | Type |
|----------|---------------|---------------|------|
| | http://localhost:8000 | http://localhost:8000 | string |
| `api_base` | {{base_url}}/api | (auto) | string |
| `patient_token` | (leave empty) | (generated) | string |
| `doctor_token` | (leave empty) | (generated) | string |
| `patient_id` | (leave empty) | (generated) | string |
| `doctor_id` | (leave empty) | (generated) | string |
| `appointment_id` | (leave empty) | (generated) | string |
| `slot_id` | (leave empty) | (generated) | string |
| `doctor_profile_id` | (leave empty) | (generated) | string |
| `time_slot_id` | (leave empty) | (generated) | string |

**How to Set Variables:**
1. Click on Environment name on top right (where it says "No Environment")
2. Select `Local_Development`
3. Edit the environment
4. Add variables in the table
5. Save

---

## Authentication Flow

### Important Notes About Authentication

- **Token-based Authentication**: All protected endpoints require an `Authorization: Token` header
- **Header Format**: `Authorization: Token abc123token456`
- **Per-User Tokens**: Each user has one unique token
- **Token Persistence**: Token remains valid until logout
- **Multiple User Types**: Patient and Doctor have different endpoints/permissions

### How Tokens Work in Postman

Every successful login/register returns a token. You'll need to:
1. Copy the token from the response
2. Set it in the environment variables
3. Use it in Authorization header for subsequent requests

**Recommended Approach:**
Use Postman's **Tests** tab to automatically extract and save tokens:

```javascript
// After Login/Register Request - Add this in "Tests" tab
if (pm.response.code === 200 || pm.response.code === 201) {
    let responseData = pm.response.json();
    if (responseData.token) {
        // Determine if it's patient or doctor based on user_type
        if (responseData.user.user_type === 'patient') {
            pm.environment.set("patient_token", responseData.token);
            pm.environment.set("patient_id", responseData.user.id);
        } else if (responseData.user.user_type === 'doctor') {
            pm.environment.set("doctor_token", responseData.token);
            pm.environment.set("doctor_id", responseData.user.id);
        }
    }
}
```

---

## Complete End-to-End Test Scenarios

### 🎯 Scenario 1: Complete Patient Journey

This scenario demonstrates a patient's complete experience from registration to health prediction.

#### Phase 1: Authentication (Patient)

**Test 1.1: Register as Patient**
```
POST {{api_base}}/accounts/register/
```

**Request Body:**
```json
{
  "username": "patient_john_{{$timestamp}}",
  "email": "patient_john_{{$timestamp}}@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient",
  "phone_number": "+1234567890"
}
```

**Expected Response (201):**
```json
{
  "user": {
    "id": 1,
    "username": "patient_john_1234567890",
    "email": "patient_john_1234567890@example.com",
    "user_type": "patient",
    "phone_number": "+1234567890",
    "profile_pic": null
  },
  "token": "abc123token456def789",
  "message": "User created successfully"
}
```

**Test Validations:**
- ✅ Status code is 201
- ✅ Response contains token
- ✅ Response contains user details
- ✅ user_type is "patient"

**Postman Test Script:**
```javascript
pm.test("Patient registration successful", function() {
    pm.expect(pm.response.code).to.equal(201);
    let responseData = pm.response.json();
    pm.expect(responseData.token).to.exist;
    pm.expect(responseData.user.user_type).to.equal("patient");
    
    // Save token and user ID
    pm.environment.set("patient_token", responseData.token);
    pm.environment.set("patient_id", responseData.user.id);
});
```

---

**Test 1.2: Login as Patient**
```
POST {{api_base}}/accounts/login/
```

**Request Body:**
```json
{
  "username": "patient_john_{{$timestamp}}",
  "password": "SecurePass123!"
}
```

**Expected Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "patient_john_1234567890",
    "email": "patient_john_1234567890@example.com",
    "user_type": "patient",
    "phone_number": "+1234567890"
  },
  "token": "abc123token456def789",
  "message": "Login successful"
}
```

**Postman Test Script:**
```javascript
pm.test("Patient login successful", function() {
    pm.expect(pm.response.code).to.equal(200);
    let responseData = pm.response.json();
    pm.expect(responseData.token).to.exist;
    pm.environment.set("patient_token", responseData.token);
});
```

---

**Test 1.3: Get Patient Profile**
```
GET {{api_base}}/accounts/profile/
Authorization: Token {{patient_token}}
```

**Expected Response (200):**
```json
{
  "id": 1,
  "username": "patient_john_1234567890",
  "email": "patient_john_1234567890@example.com",
  "user_type": "patient",
  "phone_number": "+1234567890",
  "profile_pic": null
}
```

**Postman Test Script:**
```javascript
pm.test("Profile retrieved successfully", function() {
    pm.expect(pm.response.code).to.equal(200);
    let responseData = pm.response.json();
    pm.expect(responseData.user_type).to.equal("patient");
});
```

---

#### Phase 2: Browse Doctors & Book Appointment

**Test 2.1: Get List of All Available Doctors**
```
GET {{api_base}}/doctors/list/
Authorization: Token {{patient_token}}
```

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 5,
      "username": "dr_smith",
      "first_name": "Smith",
      "email": "smith@hospital.com",
      "phone_number": "+0987654321"
    },
    "specialization": "Cardiology",
    "qualification": "MD in Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "hospital_name": "City Hospital",
    "hospital_address": "123 Main St, Downtown",
    "is_available": true
  }
]
```

**Postman Test Script:**
```javascript
pm.test("Doctors list retrieved successfully", function() {
    pm.expect(pm.response.code).to.equal(200);
    let responseData = pm.response.json();
    pm.expect(Array.isArray(responseData)).to.be.true;
    if (responseData.length > 0) {
        pm.environment.set("doctor_id", responseData[0].id);
        pm.environment.set("doctor_profile_id", responseData[0].id);
    }
});
```

---

**Test 2.2: Get Doctor Details**
```
GET {{api_base}}/doctors/{{doctor_id}}/
Authorization: Token {{patient_token}}
```

**Expected Response (200):**
```json
{
  "id": 1,
  "user": {...},
  "specialization": "Cardiology",
  "experience_years": 10,
  "consultation_fee": "500.00",
  "hospital_name": "City Hospital"
}
```

---

**Test 2.3: View Doctor's Available Slots**
```
GET {{api_base}}/doctors/{{doctor_id}}/available-slots/?date=2026-03-25
Authorization: Token {{patient_token}}
```

**Query Parameters:**
- `date`: Date in format YYYY-MM-DD (optional, defaults to today if not provided)

**Expected Response (200):**
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
    "slot_duration": 15,
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

**Postman Test Script:**
```javascript
pm.test("Available slots retrieved successfully", function() {
    pm.expect(pm.response.code).to.equal(200);
    let responseData = pm.response.json();
    pm.expect(Array.isArray(responseData)).to.be.true;
    if (responseData.length > 0) {
        pm.environment.set("slot_id", responseData[0].id);
        pm.environment.set("time_slot_id", responseData[0].id);
    }
});
```

---

**Test 2.4: Book Appointment**
```
POST {{api_base}}/appointments/book/
Authorization: Token {{patient_token}}
```

**Request Body:**
```json
{
  "doctor_id": 1,
  "date": "2026-03-25",
  "slot_number": 1,
  "symptoms": "Chest pain and shortness of breath"
}
```

**Expected Response (201):**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 101,
    "doctor": "Dr. John Smith",
    "specialization": "Cardiology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:00:00",
    "end_time": "09:15:00",
    "slot_number": 1,
    "symptoms": "Chest pain and shortness of breath",
    "status": "pending"
  }
}
```

**Postman Test Script:**
```javascript
pm.test("Appointment booked successfully", function() {
    pm.expect(pm.response.code).to.equal(201);
    let responseData = pm.response.json();
    pm.expect(responseData.appointment.status).to.equal("pending");
    pm.environment.set("appointment_id", responseData.appointment.id);
});
```

---

**Test 2.5: Get Patient's Appointments**
```
GET {{api_base}}/appointments/my-appointments/
Authorization: Token {{patient_token}}
```

**Query Parameters (Optional):**
- `status=pending` - Filter by status
- `ordering=-date` - Sort by date (descending)
- `limit=20` - Number of results
- `offset=0` - Pagination offset

**Expected Response (200):**
```json
[
  {
    "id": 101,
    "patient": 10,
    "patient_details": {...},
    "time_slot": {...},
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "appointment_date": "2026-03-25",
    "appointment_time": "09:00:00 - 09:15:00",
    "status": "pending",
    "symptoms": "Chest pain and shortness of breath",
    "notes": null,
    "created_at": "2026-03-20T10:30:45Z"
  }
]
```

---

#### Phase 3: Health Prediction

**Test 3.1: Make Health Prediction**
```
POST {{api_base}}/predictions/predict/
Authorization: Token {{patient_token}}
```

**Request Body:**
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
  "smoking": "no",
  "alcohol": "no"
}
```

**Expected Response (201) - Low Risk:**
```json
{
  "risk_level": "low",
  "prescription": "Stay hydrated, maintain regular exercise, balanced diet, adequate sleep",
  "message": "Health prediction completed successfully"
}
```

**Expected Response (201) - High Risk:**
```json
{
  "risk_level": "high",
  "prescription": "Immediate medical consultation required. Monitor daily. Reduce salt and fat intake.",
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

**Postman Test Script:**
```javascript
pm.test("Health prediction completed successfully", function() {
    pm.expect(pm.response.code).to.equal(201);
    let responseData = pm.response.json();
    pm.expect(responseData.risk_level).to.be.oneOf(["low", "medium", "high"]);
    pm.expect(responseData.prescription).to.exist;
});
```

---

### 🎯 Scenario 2: Complete Doctor Journey

#### Phase 1: Doctor Registration & Profile Setup

**Test 1.1: Register as Doctor**
```
POST {{api_base}}/accounts/register/
```

**Request Body:**
```json
{
  "username": "dr_smith_{{$timestamp}}",
  "email": "dr_smith_{{$timestamp}}@hospital.com",
  "password": "DoctorPass123!",
  "password2": "DoctorPass123!",
  "first_name": "John",
  "last_name": "Smith",
  "user_type": "doctor",
  "phone_number": "+0987654321"
}
```

**Expected Response (201):**
```json
{
  "user": {
    "id": 5,
    "username": "dr_smith_1234567890",
    "email": "dr_smith_1234567890@hospital.com",
    "user_type": "doctor",
    "phone_number": "+0987654321"
  },
  "token": "doctor_token_abc123",
  "message": "User created successfully"
}
```

**Postman Test Script:**
```javascript
pm.test("Doctor registration successful", function() {
    pm.expect(pm.response.code).to.equal(201);
    let responseData = pm.response.json();
    pm.expect(responseData.user.user_type).to.equal("doctor");
    pm.environment.set("doctor_token", responseData.token);
    pm.environment.set("doctor_user_id", responseData.user.id);
});
```

---

**Test 1.2: Create Doctor Profile**
```
POST {{api_base}}/doctors/create-profile/
Authorization: Token {{doctor_token}}
```

**Request Body:**
```json
{
  "specialization": "Cardiology",
  "qualification": "MD in Cardiology",
  "experience_years": 10,
  "consultation_fee": 500.00,
  "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "time_slots": [
    {"start": "09:00", "end": "12:00"},
    {"start": "14:00", "end": "17:00"}
  ],
  "consultation_duration": 30,
  "slot_duration": 15,
  "hospital_name": "City Hospital",
  "hospital_address": "123 Main St, Downtown"
}
```

**Expected Response (201):**
```json
{
  "message": "Doctor profile created successfully",
  "doctor_profile": {
    "id": 1,
    "user": {...},
    "specialization": "Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "hospital_name": "City Hospital",
    "is_available": true
  }
}
```

**Postman Test Script:**
```javascript
pm.test("Doctor profile created successfully", function() {
    pm.expect(pm.response.code).to.equal(201);
    let responseData = pm.response.json();
    pm.expect(responseData.doctor_profile.specialization).to.equal("Cardiology");
    pm.environment.set("doctor_profile_id", responseData.doctor_profile.id);
});
```

---

**Test 1.3: Check Doctor Profile**
```
GET {{api_base}}/doctors/check-profile/
Authorization: Token {{doctor_token}}
```

**Expected Response (200):**
```json
{
  "exists": true,
  "profile": {
    "id": 1,
    "specialization": "Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "is_available": true
  }
}
```

---

**Test 1.4: Get Doctor's Own Profile**
```
GET {{api_base}}/doctors/my-profile/
Authorization: Token {{doctor_token}}
```

---

#### Phase 2: Slot Management

**Test 2.1: Generate Time Slots Automatically**
```
POST {{api_base}}/doctors/generate-slots/
Authorization: Token {{doctor_token}}
```

**Request Body:**
```json
{
  "start_date": "2026-03-21",
  "end_date": "2026-04-30",
  "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "time_slots": [
    {"start": "09:00", "end": "12:00"},
    {"start": "14:00", "end": "17:00"}
  ],
  "slot_duration": 15
}
```

**Expected Response (201):**
```json
{
  "message": "Slots generated successfully",
  "slots_generated": 80,
  "date_range": "2026-03-21 to 2026-04-30",
  "slots": [
    {
      "id": 101,
      "date": "2026-03-22",
      "day": "Monday",
      "start_time": "09:00:00",
      "end_time": "09:15:00",
      "slot_number": 1,
      "is_booked": false
    }
  ]
}
```

---

**Test 2.2: View Doctor's Slots**
```
GET {{api_base}}/doctors/my-slots/
Authorization: Token {{doctor_token}}
```

**Query Parameters (Optional):**
- `date=2026-03-25` - Filter by specific date
- `is_booked=false` - Filter available slots
- `limit=20` - Number of results

---

**Test 2.3: Add Single Time Slot**
```
POST {{api_base}}/doctors/add-slot/
Authorization: Token {{doctor_token}}
```

**Request Body:**
```json
{
  "date": "2026-03-30",
  "start_time": "10:00",
  "end_time": "11:00",
  "slot_number": 5
}
```

---

**Test 2.4: Delete Specific Slot**
```
DELETE {{api_base}}/doctors/delete-slot/{{slot_id}}/
Authorization: Token {{doctor_token}}
```

---

#### Phase 3: View & Manage Appointments

**Test 3.1: Get Doctor's Appointments**
```
GET {{api_base}}/appointments/doctor/appointments/
Authorization: Token {{doctor_token}}
```

**Expected Response (200):**
```json
[
  {
    "id": 101,
    "patient": "patient_john",
    "doctor_name": "Dr. John Smith",
    "appointment_date": "2026-03-25",
    "appointment_time": "09:00:00 - 09:15:00",
    "status": "pending",
    "symptoms": "Chest pain",
    "notes": null,
    "created_at": "2026-03-20T10:30:45Z"
  }
]
```

---

**Test 3.2: Get Today's Appointments**
```
GET {{api_base}}/appointments/doctor/today/
Authorization: Token {{doctor_token}}
```

---

**Test 3.3: Update Appointment Status**
```
PATCH {{api_base}}/appointments/doctor/update-status/{{appointment_id}}/
Authorization: Token {{doctor_token}}
```

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Patient appeared with all required documents"
}
```

**Status Options:** `pending`, `confirmed`, `completed`, `cancelled`

---

### 🎯 Scenario 3: Error Handling & Edge Cases

**Test 3.1: Duplicate Username Registration**
```
POST {{api_base}}/accounts/register/
```

**Request Body:**
```json
{
  "username": "patient_john_1234567890",
  "email": "new_email@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient",
  "phone_number": "+1234567890"
}
```

**Expected Response (400):**
```json
{
  "username": ["This field must be unique."]
}
```

---

**Test 3.2: Invalid Password Match**
```
POST {{api_base}}/accounts/register/
```

**Request Body:**
```json
{
  "username": "test_user",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "password2": "DifferentPass123!",
  "first_name": "Test",
  "last_name": "User",
  "user_type": "patient",
  "phone_number": "+1234567890"
}
```

**Expected Response (400):**
```json
{
  "password": ["Password fields didn't match."]
}
```

---

**Test 3.3: Missing Authorization Token**
```
GET {{api_base}}/appointments/my-appointments/
```

**Expected Response (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

**Test 3.4: Invalid Token**
```
GET {{api_base}}/appointments/my-appointments/
Authorization: Token invalid_token_abc123
```

**Expected Response (401):**
```json
{
  "detail": "Invalid token."
}
```

---

**Test 3.5: Patient Trying to Create Doctor Profile**
```
POST {{api_base}}/doctors/create-profile/
Authorization: Token {{patient_token}}
```

**Expected Response (403):**
```json
{
  "error": "Only doctors can create doctor profiles"
}
```

---

**Test 3.6: Patient Trying to Book Past Date Appointment**
```
POST {{api_base}}/appointments/book/
Authorization: Token {{patient_token}}
```

**Request Body:**
```json
{
  "doctor_id": 1,
  "date": "2026-03-20",
  "slot_number": 1,
  "symptoms": "Test symptoms"
}
```

**Expected Response (400):**
```json
{
  "date": "Cannot book appointments for past dates"
}
```

---

**Test 3.7: Double Booking Prevention**
```
POST {{api_base}}/appointments/book/
Authorization: Token {{patient_token}}
```

*Try to book the same slot twice*

**Expected Response (400):**
```json
{
  "error": "You already have an appointment at this time"
}
```

---

**Test 3.8: Invalid Health Prediction Data**
```
POST {{api_base}}/predictions/predict/
Authorization: Token {{patient_token}}
```

**Request Body:**
```json
{
  "age": 200,
  "gender": "male",
  "weight": 400,
  "height": 300,
  "temperature": 50,
  "blood_pressure": 300,
  "sleep": 25,
  "heart_rate": 300,
  "smoking": "no",
  "alcohol": "no"
}
```

**Expected Response (400):**
```json
{
  "age": ["Ensure this value is less than or equal to 120."],
  "weight": ["Ensure this value is less than or equal to 300."],
  "temperature": ["Ensure this value is less than or equal to 42."]
}
```

---

## API Endpoint Testing

### 1. Accounts API

#### Base URL: `/api/accounts/`

| # | Endpoint | Method | Auth | Test Name |
|---|----------|--------|------|-----------|
| 1.1 | `/register/` | POST | ❌ | User Registration |
| 1.2 | `/login/` | POST | ❌ | User Login |
| 1.3 | `/profile/` | GET | ✅ | Get Profile |
| 1.4 | `/profile/` | PUT | ✅ | Update Profile |
| 1.5 | `/logout/` | POST | ✅ | User Logout |

---

### 2. Doctors API

#### Base URL: `/api/doctors/`

| # | Endpoint | Method | Auth | Role | Test Name |
|---|----------|--------|------|------|-----------|
| 2.1 | `/create-profile/` | POST | ✅ | Doctor | Create Doctor Profile |
| 2.2 | `/check-profile/` | GET | ✅ | Doctor | Check Profile Existence |
| 2.3 | `/my-profile/` | GET | ✅ | Doctor | Get My Profile |
| 2.4 | `/update-profile/` | PUT | ✅ | Doctor | Update Doctor Profile |
| 2.5 | `/generate-slots/` | POST | ✅ | Doctor | Generate Time Slots |
| 2.6 | `/my-slots/` | GET | ✅ | Doctor | View My Slots |
| 2.7 | `/add-slot/` | POST | ✅ | Doctor | Add Single Slot |
| 2.8 | `/delete-slot/<id>/` | DELETE | ✅ | Doctor | Delete Specific Slot |
| 2.9 | `/delete-slot/` | DELETE | ✅ | Doctor | Delete Slots by Date |
| 2.10 | `/delete-all-slots/` | DELETE | ✅ | Doctor | Delete All Slots |
| 2.11 | `/list/` | GET | ✅ | Patient | List All Doctors |
| 2.12 | `/<id>/` | GET | ✅ | Patient | Get Doctor Details |
| 2.13 | `/<doctor_id>/available-slots/` | GET | ✅ | Patient | Get Available Slots |

---

### 3. Appointments API

#### Base URL: `/api/appointments/`

| # | Endpoint | Method | Auth | Role | Test Name |
|---|----------|--------|------|------|-----------|
| 3.1 | `/book/` | POST | ✅ | Patient | Book Appointment |
| 3.2 | `/my-appointments/` | GET | ✅ | Patient | Get My Appointments |
| 3.3 | `/cancel/<id>/` | DELETE | ✅ | Patient | Cancel Appointment |
| 3.4 | `/doctor/appointments/` | GET | ✅ | Doctor | Get Doctor Appointments |
| 3.5 | `/doctor/today/` | GET | ✅ | Doctor | Get Today's Appointments |
| 3.6 | `/doctor/update-status/<id>/` | PATCH | ✅ | Doctor | Update Status |
| 3.7 | `/upcoming/` | GET | ✅ | Both | Get Upcoming Appointments |
| 3.8 | `/<id>/` | GET | ✅ | Both | Get Appointment Details |
| 3.9 | `/check-slot/<slot_id>/` | GET | ✅ | Patient | Check Slot Availability |

---

### 4. Predictions API

#### Base URL: `/api/predictions/`

| # | Endpoint | Method | Auth | Role | Test Name |
|---|----------|--------|------|------|-----------|
| 4.1 | `/predict/` | POST | ✅ | Patient | Make Health Prediction |
| 4.2 | `/history/` | GET | ✅ | Patient | Get Prediction History |
| 4.3 | `/<id>/` | GET | ✅ | Patient | Get Prediction Details |

---

## Error Handling & Troubleshooting

### Common HTTP Status Codes

| Code | Meaning | Common Cause | Solution |
|------|---------|-------------|----------|
| `200` | OK | Request successful | N/A |
| `201` | Created | Resource created successfully | N/A |
| `400` | Bad Request | Invalid data | Check request body format |
| `401` | Unauthorized | Missing/invalid token | Add token to header |
| `403` | Forbidden | Insufficient permissions | Check user role (patient/doctor) |
| `404` | Not Found | Resource doesn't exist | Verify resource ID |
| `500` | Server Error | Backend error | Check server logs |

---

### Troubleshooting Checklist

#### Token Issues
- [ ] Token is properly set in environment variables
- [ ] Token is included in Authorization header format: `Token abc123`
- [ ] Token hasn't expired (login again if needed)
- [ ] Token is for the correct user type (patient/doctor)

#### Request Body Issues
- [ ] Content-Type header is set to `application/json`
- [ ] All required fields are included
- [ ] Data types match specification (string, number, boolean)
- [ ] Date format is YYYY-MM-DD
- [ ] Time format is HH:MM (24-hour)

#### Authorization Issues
- [ ] User role matches endpoint requirement (patient vs doctor)
- [ ] Patient cannot access doctor-only endpoints
- [ ] Doctor cannot access patient-only endpoints

#### Date/Time Issues
- [ ] Cannot book past dates
- [ ] Time slots must be within doctor's available hours
- [ ] Slot duration must match doctor's settings

---

### Testing Checklist

Use this checklist for complete API validation:

#### Authentication (Accounts API)
- [ ] Register as patient - success
- [ ] Register with duplicate username - error 400
- [ ] Register with mismatched passwords - error 400
- [ ] Register with weak password - error 400
- [ ] Login with valid credentials - success
- [ ] Login with invalid credentials - error 400
- [ ] Get profile - success
- [ ] Update profile - success
- [ ] Update without token - error 401

#### Doctor Management (Doctors API)
- [ ] Register as doctor - success
- [ ] Create doctor profile - success
- [ ] Create duplicate profile - error 400
- [ ] Update doctor profile - success
- [ ] Patient cannot create profile - error 403
- [ ] Generate time slots - success
- [ ] View generated slots - success
- [ ] Add single slot - success
- [ ] Delete slot - success
- [ ] Patient can view doctor list - success
- [ ] Patient can view available slots - success

#### Appointment Booking (Appointments API)
- [ ] Patient books appointment - success
- [ ] View booked appointment - success
- [ ] Doctor views appointments - success
- [ ] Doctor updates appointment status - success
- [ ] Cancel appointment - success
- [ ] Cannot book past date - error 400
- [ ] Cannot double book - error 400
- [ ] Doctor cannot book appointment - error 403

#### Health Prediction (Predictions API)
- [ ] Patient makes prediction - success
- [ ] Prediction triggers doctor recommendation - success
- [ ] Invalid data rejected - error 400
- [ ] Doctor cannot make prediction - error 403
- [ ] View prediction history - success

---

## Postman Collection JSON

You can import this collection directly into Postman:

1. In Postman, click "Import"
2. Select "Raw text" tab
3. Paste the JSON collection
4. Click "Import"

*Note: The actual collection JSON would be generated from the requests you create in Postman. Use "Export" option to save your collection.*

---

## Testing Tips & Best Practices

1. **Use Environment Variables**: Always use `{{variable_name}}` instead of hardcoding values
2. **Chain Requests**: Set variables in Tests tab to automate token extraction
3. **Test Ordering**: Create tests in the correct logical sequence
4. **Error Testing**: Test both success and error scenarios
5. **Data Cleanup**: Delete test accounts after verification
6. **Monitor Response Times**: Check performance
7. **Validate Data Types**: Ensure responses match documentation
8. **Test Pagination**: Test with different limit/offset values
9. **Test Filters**: Verify filtering works correctly
10. **Document Results**: Keep test results notes

---

## Integration Testing Examples

### Complete Patient Workflow (Single Collection Run)

```
1. Register Patient → save token → patient_token
2. Login Patient → verify token
3. Get Patient Profile → verify details
4. Browse Doctors → pick doctor_id
5. View Available Slots → pick slot_id
6. Book Appointment → save appointment_id
7. View My Appointments → verify booking
8. Make Health Prediction → verify risk assessment
9. Update Profile → verify changes
10. View Appointment Details → verify completeness
```

### Complete Doctor Workflow (Single Collection Run)

```
1. Register Doctor → save token → doctor_token
2. Create Doctor Profile → save profile_id
3. Generate Time Slots → verify slots created
4. View My Slots → verify slots visible
5. Patient books appointment → (from patient workflow)
6. View My Appointments → verify appointment listed
7. Update Appointment Status → change to confirmed
8. Update Doctor Profile → modify fee/specialization
9. View Today's Appointments → verify today's list
10. Add Additional Slot → verify new slot added
```

---

**End of Postman Testing Guide**

*Last Updated: March 21, 2026*
*Version: 1.0*
