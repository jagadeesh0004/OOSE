# 🧑‍⚕️ Doctors API Documentation

## Overview
The Doctors API manages doctor profiles, time slot generation, and slot management. It allows doctors to set up their profiles, generate available consultation slots, and patients to view available doctors.

---

## 🔌 Base URL
```
/api/doctors/
```

---

## 📋 API Endpoints

## 🏥 PROFILE MANAGEMENT ENDPOINTS

### 1. **Create Doctor Profile**
**Create a new doctor profile after registration (Doctor only)**

- **Endpoint:** `POST /create-profile/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
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
  "slot_duration": 10,
  "hospital_name": "City Hospital",
  "hospital_address": "123 Main St, Downtown"
}
```

#### Response (201 Created)
```json
{
  "message": "Doctor profile created successfully",
  "doctor_profile": {
    "id": 1,
    "user": {
      "id": 5,
      "username": "dr_smith",
      "email": "smith@hospital.com",
      "user_type": "doctor",
      "phone_number": "+1234567890",
      "profile_pic": null
    },
    "specialization": "Cardiology",
    "qualification": "MD in Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "time_slots": [
      {"start": "09:00", "end": "12:00"},
      {"start": "14:00", "end": "17:00"}
    ],
    "consultation_duration": 30,
    "slot_duration": 10,
    "hospital_name": "City Hospital",
    "hospital_address": "123 Main St, Downtown",
    "is_available": true
  }
}
```

#### Error Responses
- **403 Forbidden:** User is not a doctor
  ```json
  {
    "error": "Only doctors can create doctor profiles"
  }
  ```
- **400 Bad Request:** Profile already exists
  ```json
  {
    "error": "Doctor profile already exists for this user"
  }
  ```
- **400 Bad Request:** Invalid time slots
  ```json
  {
    "time_slots": ["Invalid time format. Use HH:MM (24-hour format)"]
  }
  ```

#### Validations
- ✅ User must be registered as doctor (user_type = 'doctor')
- ✅ Doctor can only have ONE profile
- ✅ Time slots must be in HH:MM format (24-hour)
- ✅ Start time must be before end time
- ✅ Slot duration must be between 5-120 minutes
- ✅ available_days must be valid day names

---

### 2. **Check Doctor Profile Existence**
**Check if logged-in doctor has a profile**

- **Endpoint:** `GET /check-profile/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /check-profile/
Authorization: Token abc123token456
```

#### Response (200 OK) - Profile Exists
```json
{
  "exists": true,
  "profile": {
    "id": 1,
    "user": {
      "id": 5,
      "username": "dr_smith",
      "email": "smith@hospital.com",
      "user_type": "doctor",
      "phone_number": "+1234567890"
    },
    "specialization": "Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "hospital_name": "City Hospital",
    "is_available": true
  }
}
```

#### Response (200 OK) - Profile Does Not Exist
```json
{
  "exists": false,
  "message": "Doctor profile not found. Please create your profile."
}
```

---

### 3. **Get Doctor's Own Profile**
**Retrieve logged-in doctor's profile details**

- **Endpoint:** `GET /my-profile/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /my-profile/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user": {
    "id": 5,
    "username": "dr_smith",
    "email": "smith@hospital.com",
    "user_type": "doctor",
    "phone_number": "+1234567890",
    "profile_pic": "profiles/dr_smith.jpg"
  },
  "specialization": "Cardiology",
  "qualification": "MD in Cardiology",
  "experience_years": 10,
  "consultation_fee": "500.00",
  "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "time_slots": [
    {"start": "09:00", "end": "12:00"},
    {"start": "14:00", "end": "17:00"}
  ],
  "consultation_duration": 30,
  "slot_duration": 10,
  "hospital_name": "City Hospital",
  "hospital_address": "123 Main St, Downtown",
  "is_available": true
}
```

#### Error Responses
- **404 Not Found:** Doctor profile not found

---

### 4. **Update Doctor Profile**
**Update doctor's profile information**

- **Endpoint:** `PUT /update-profile/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body (Partial Update - Any field)
```json
{
  "consultation_fee": 600.00,
  "hospital_name": "New City Hospital",
  "is_available": false,
  "time_slots": [
    {"start": "10:00", "end": "13:00"},
    {"start": "15:00", "end": "18:00"}
  ]
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "user": {...},
  "specialization": "Cardiology",
  "consultation_fee": "600.00",
  "hospital_name": "New City Hospital",
  "is_available": false,
  "time_slots": [
    {"start": "10:00", "end": "13:00"},
    {"start": "15:00", "end": "18:00"}
  ],
  ...
}
```

#### Updateable Fields
- ✅ `specialization`
- ✅ `qualification`
- ✅ `experience_years`
- ✅ `consultation_fee`
- ✅ `available_days`
- ✅ `time_slots`
- ✅ `consultation_duration`
- ✅ `slot_duration`
- ✅ `hospital_name`
- ✅ `hospital_address`
- ✅ `is_available`

---

## 🕐 TIME SLOT MANAGEMENT ENDPOINTS

### 5. **Generate Time Slots**
**Auto-generate time slots for multiple days**

- **Endpoint:** `POST /generate-slots/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
```json
{
  "start_date": "2026-03-25",
  "end_date": "2026-03-31",
  "time_slots": [
    {"start": "09:00", "end": "12:00"},
    {"start": "14:00", "end": "17:00"}
  ],
  "days_to_generate": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}
```

#### Response (201 Created)
```json
{
  "message": "Time slots generated successfully",
  "generated_slots_count": 48,
  "slots": [
    {
      "id": 101,
      "doctor": 1,
      "doctor_name": "Dr. John Smith",
      "doctor_specialization": "Cardiology",
      "date": "2026-03-25",
      "day": "Wednesday",
      "start_time": "09:00:00",
      "end_time": "09:10:00",
      "slot_number": 1,
      "slot_duration": 10,
      "is_booked": false
    },
    ...
  ]
}
```

#### Validations
- ✅ Start date must not be in the past
- ✅ End date must be after start date
- ✅ Days must be valid day names
- ✅ Time slots must have valid HH:MM format

---

### 6. **Get Doctor's Time Slots**
**Retrieve all time slots created by the doctor**

- **Endpoint:** `GET /my-slots/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Authentication Header:** `Authorization: Token <token>`

#### Query Parameters (Optional)
```
?date=2026-03-25&is_booked=false&limit=20&offset=0
```

#### Request
```
GET /my-slots/?date=2026-03-25
Authorization: Token abc123token456
```

#### Response (200 OK)
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
    "end_time": "09:10:00",
    "slot_number": 1,
    "slot_duration": 10,
    "is_booked": false
  },
  {
    "id": 102,
    "doctor": 1,
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:10:00",
    "end_time": "09:20:00",
    "slot_number": 2,
    "slot_duration": 10,
    "is_booked": false
  }
]
```

---

### 7. **Add Single Time Slot**
**Add a single time slot manually**

- **Endpoint:** `POST /add-slot/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
```json
{
  "date": "2026-03-26",
  "start_time": "10:00",
  "end_time": "10:30"
}
```

#### Response (201 Created)
```json
{
  "id": 103,
  "doctor": 1,
  "doctor_name": "Dr. John Smith",
  "doctor_specialization": "Cardiology",
  "date": "2026-03-26",
  "day": "Thursday",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "slot_number": 3,
  "slot_duration": 30,
  "is_booked": false
}
```

#### Error Responses
- **400 Bad Request:** Date in the past
  ```json
  {
    "date": ["Cannot create slots for past dates"]
  }
  ```
- **400 Bad Request:** Duplicate slot
  ```json
  {
    "error": "Slot already exists for this time"
  }
  ```

---

### 8. **Delete Time Slot by ID**
**Delete a specific time slot by ID**

- **Endpoint:** `DELETE /delete-slot/<id>/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
DELETE /delete-slot/101/
Authorization: Token abc123token456
```

#### Response (204 No Content)
```
(No response body)
```

#### Error Responses
- **404 Not Found:** Slot not found
- **403 Forbidden:** Cannot delete booked slots
  ```json
  {
    "error": "Cannot delete a booked slot"
  }
  ```

---

### 9. **Delete Time Slots by Date**
**Delete all slots for a specific date**

- **Endpoint:** `DELETE /delete-slot/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
```json
{
  "date": "2026-03-25"
}
```

#### Response (200 OK)
```json
{
  "message": "All slots for 2026-03-25 deleted successfully",
  "deleted_count": 12
}
```

#### Error Responses
- **400 Bad Request:** Date in the past
  ```json
  {
    "error": "Cannot delete slots for past dates"
  }
  ```

---

### 10. **Delete All Time Slots**
**Delete all time slots for the doctor**

- **Endpoint:** `DELETE /delete-all-slots/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
DELETE /delete-all-slots/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "message": "All slots deleted successfully",
  "deleted_count": 156
}
```

---

## 👥 PUBLIC DOCTOR ENDPOINTS (For Patients)

### 11. **List All Doctors**
**Get list of all available doctors**

- **Endpoint:** `GET /list/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Query Parameters (Optional)
```
?specialization=Cardiology&is_available=true&limit=20&offset=0
```

#### Request
```
GET /list/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "user": {
      "id": 5,
      "username": "dr_smith",
      "email": "smith@hospital.com",
      "user_type": "doctor",
      "phone_number": "+1234567890",
      "profile_pic": "profiles/dr_smith.jpg"
    },
    "specialization": "Cardiology",
    "qualification": "MD in Cardiology",
    "experience_years": 10,
    "consultation_fee": "500.00",
    "hospital_name": "City Hospital",
    "hospital_address": "123 Main St, Downtown",
    "is_available": true
  },
  {
    "id": 2,
    "user": {
      "id": 6,
      "username": "dr_jones",
      "email": "jones@hospital.com",
      "user_type": "doctor",
      "phone_number": "+0987654321",
      "profile_pic": null
    },
    "specialization": "Dermatology",
    "qualification": "MD in Dermatology",
    "experience_years": 8,
    "consultation_fee": "400.00",
    "hospital_name": "General Hospital",
    "hospital_address": "456 Oak Ave",
    "is_available": true
  }
]
```

---

### 12. **Get Doctor Details**
**Get specific doctor's profile (for patients)**

- **Endpoint:** `GET /<id>/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /2/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "id": 2,
  "user": {
    "id": 6,
    "username": "dr_jones",
    "email": "jones@hospital.com",
    "user_type": "doctor",
    "phone_number": "+0987654321"
  },
  "specialization": "Dermatology",
  "qualification": "MD in Dermatology",
  "experience_years": 8,
  "consultation_fee": "400.00",
  "hospital_name": "General Hospital",
  "hospital_address": "456 Oak Ave",
  "is_available": true
}
```

---

### 13. **Get Available Slots for Doctor**
**Get all available (unbooked) time slots for a specific doctor**

- **Endpoint:** `GET /<doctor_id>/available-slots/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /2/available-slots/?date=2026-03-25
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 201,
    "doctor": 2,
    "doctor_name": "Dr. Jane Jones",
    "doctor_specialization": "Dermatology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:00:00",
    "end_time": "09:15:00",
    "slot_number": 1,
    "slot_duration": 15,
    "is_booked": false
  },
  {
    "id": 202,
    "doctor": 2,
    "doctor_name": "Dr. Jane Jones",
    "doctor_specialization": "Dermatology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:15:00",
    "end_time": "09:30:00",
    "slot_number": 2,
    "slot_duration": 15,
    "is_booked": false
  }
]
```

---

## 📊 Data Models

### DoctorProfile Model
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Profile ID |
| `user` | OneToOne | Yes | Associated User (Doctor) |
| `specialization` | String | Yes | Medical speciality (e.g., Cardiology) |
| `qualification` | String | Yes | Qualifications (e.g., MD, MBBS) |
| `experience_years` | Integer | Yes | Years of practice |
| `consultation_fee` | Decimal | Yes | Consultation fee per appointment |
| `available_days` | JSON | Yes | Days available (e.g., ["Mon", "Tue"]) |
| `time_slots` | JSON | Yes | Available time ranges |
| `consultation_duration` | Integer | Yes | Duration of consultation (minutes) |
| `slot_duration` | Integer | Yes | Duration of each slot (minutes) |
| `hospital_name` | String | Yes | Associated hospital |
| `hospital_address` | TextField | Yes | Hospital location |
| `is_available` | Boolean | Auto | Availability status |

### TimeSlot Model
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Slot ID |
| `doctor` | ForeignKey | Yes | Associated doctor |
| `date` | Date | Yes | Appointment date |
| `start_time` | Time | Yes | Slot start time |
| `end_time` | Time | Yes | Slot end time |
| `slot_number` | Integer | Auto | Sequential slot number |
| `slot_duration` | Integer | Auto | Duration in minutes |
| `is_booked` | Boolean | Auto | Booking status |

---

## 📝 Example Usage (cURL)

### Create Doctor Profile
```bash
curl -X POST http://localhost:8000/api/doctors/create-profile/ \
  -H "Authorization: Token abc123token456" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Cardiology",
    "qualification": "MD in Cardiology",
    "experience_years": 10,
    "consultation_fee": 500.00,
    "available_days": ["Monday", "Tuesday", "Wednesday"],
    "time_slots": [{"start": "09:00", "end": "12:00"}],
    "consultation_duration": 30,
    "slot_duration": 10,
    "hospital_name": "City Hospital",
    "hospital_address": "123 Main St"
  }'
```

### Generate Time Slots
```bash
curl -X POST http://localhost:8000/api/doctors/generate-slots/ \
  -H "Authorization: Token abc123token456" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-03-25",
    "end_date": "2026-03-31",
    "time_slots": [{"start": "09:00", "end": "12:00"}],
    "days_to_generate": ["Monday", "Wednesday", "Friday"]
  }'
```

### List Available Doctors
```bash
curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token abc123token456"
```

---

## ⚠️ Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 403 | Only doctors can create profiles | Ensure user_type is 'doctor' |
| 400 | Profile already exists | Check if profile is already created |
| 404 | Not found | Invalid doctor ID or resource doesn't exist |
| 400 | Date in past | Use future dates for slot generation |
| 400 | Invalid time format | Use HH:MM format (24-hour) |

---
