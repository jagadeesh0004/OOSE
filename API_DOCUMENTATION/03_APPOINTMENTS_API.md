# 📅 Appointments API Documentation

## Overview
The Appointments API handles booking, cancellation, and management of doctor appointments. It manages the complete lifecycle of appointments from booking to completion.

---

## 🔌 Base URL
```
/api/appointments/
```

---

## 📋 API Endpoints

## 👤 PATIENT ENDPOINTS

### 1. **Book Appointment**
**Book an appointment with a doctor (Patient only)**

- **Endpoint:** `POST /book/`
- **Permission:** `IsAuthenticated` (Patient only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
```json
{
  "doctor_id": 1,
  "date": "2026-03-25",
  "slot_number": 3,
  "symptoms": "Chest pain and shortness of breath"
}
```

#### Response (201 Created)
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 101,
    "doctor": "Dr. John Smith",
    "specialization": "Cardiology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:30:00",
    "end_time": "09:45:00",
    "slot_number": 3,
    "symptoms": "Chest pain and shortness of breath",
    "status": "pending"
  }
}
```

#### Error Responses
- **403 Forbidden:** User is not a patient
  ```json
  {
    "error": "Only patients can book appointments"
  }
  ```
- **404 Not Found:** Doctor not found
  ```json
  {
    "doctor_id": "Doctor not found"
  }
  ```
- **400 Bad Request:** Slot not available
  ```json
  {
    "error": "Slot #3 on 2026-03-25 is not available for this doctor"
  }
  ```
- **400 Bad Request:** Date in the past
  ```json
  {
    "date": "Cannot book appointments for past dates"
  }
  ```
- **400 Bad Request:** Already has appointment at this time
  ```json
  {
    "error": "You already have an appointment at this time"
  }
  ```

#### Validations
- ✅ User must be a patient (user_type = 'patient')
- ✅ Doctor must exist
- ✅ Date must not be in the past
- ✅ Slot must be unbooked (is_booked = false)
- ✅ Slot number must be valid for the doctor on that date
- ✅ Patient cannot double-book at the same time
- ✅ Symptoms field is required

#### Workflow
1. Slot is marked as booked (is_booked = true)
2. Appointment is created with status = 'pending'
3. Doctor can later confirm or update the status

---

### 2. **Get Patient's Appointments**
**Retrieve all appointments for the logged-in patient**

- **Endpoint:** `GET /my-appointments/`
- **Permission:** `IsAuthenticated` (Patient only)
- **Authentication Header:** `Authorization: Token <token>`

#### Query Parameters (Optional)
```
?status=pending&ordering=-date&limit=20&offset=0
```

#### Request
```
GET /my-appointments/?status=pending
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 101,
    "patient": 10,
    "patient_details": {
      "id": 10,
      "username": "john_patient",
      "email": "john@example.com",
      "user_type": "patient",
      "phone_number": "+1234567890"
    },
    "time_slot": {
      "id": 301,
      "doctor": 1,
      "doctor_name": "Dr. John Smith",
      "doctor_specialization": "Cardiology",
      "date": "2026-03-25",
      "day": "Wednesday",
      "start_time": "09:30:00",
      "end_time": "09:45:00",
      "slot_number": 3,
      "slot_duration": 15,
      "is_booked": true
    },
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "appointment_date": "2026-03-25",
    "appointment_time": "09:30:00 - 09:45:00",
    "status": "pending",
    "symptoms": "Chest pain and shortness of breath",
    "notes": null,
    "created_at": "2026-03-20T10:30:45Z",
    "updated_at": "2026-03-20T10:30:45Z"
  },
  {
    "id": 102,
    "patient": 10,
    "patient_details": {...},
    "time_slot": {...},
    "doctor_name": "Dr. Jane Jones",
    "doctor_specialization": "Dermatology",
    "appointment_date": "2026-03-28",
    "appointment_time": "14:00:00 - 14:15:00",
    "status": "confirmed",
    "symptoms": "Skin rash",
    "notes": "Apply prescribed cream for 5 days",
    "created_at": "2026-03-19T15:20:30Z",
    "updated_at": "2026-03-20T08:00:00Z"
  }
]
```

#### Status Options
| Status | Meaning |
|--------|---------|
| `pending` | Awaiting doctor confirmation |
| `confirmed` | Doctor confirmed the appointment |
| `completed` | Appointment has been completed |
| `cancelled` | Appointment was cancelled |

---

### 3. **Cancel Appointment**
**Cancel a booked appointment (Patient only)**

- **Endpoint:** `DELETE /cancel/<id>/`
- **Permission:** `IsAuthenticated` (Patient only)
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
DELETE /cancel/101/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "message": "Appointment cancelled successfully",
  "appointment_id": 101,
  "status": "cancelled"
}
```

#### Error Responses
- **404 Not Found:** Appointment not found
  ```json
  {
    "error": "Appointment not found"
  }
  ```
- **403 Forbidden:** Cannot cancel appointment (not owner or already completed)
  ```json
  {
    "error": "Cannot cancel this appointment"
  }
  ```
- **400 Bad Request:** Appointment already cancelled
  ```json
  {
    "error": "Appointment is already cancelled"
  }
  ```

#### Workflow
1. Appointment status is changed to 'cancelled'
2. Associated TimeSlot is marked as unbooked (is_booked = false)
3. Slot becomes available again for other patients

---

## 🧑‍⚕️ DOCTOR ENDPOINTS

### 4. **Get Doctor's Appointments**
**Retrieve all appointments for the logged-in doctor**

- **Endpoint:** `GET /doctor/appointments/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Authentication Header:** `Authorization: Token <token>`

#### Query Parameters (Optional)
```
?status=pending&ordering=-date&limit=20&offset=0
```

#### Request
```
GET /doctor/appointments/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 101,
    "patient": 10,
    "patient_details": {
      "id": 10,
      "username": "john_patient",
      "email": "john@example.com",
      "user_type": "patient",
      "phone_number": "+1234567890"
    },
    "time_slot": {...},
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "appointment_date": "2026-03-25",
    "appointment_time": "09:30:00 - 09:45:00",
    "status": "pending",
    "symptoms": "Chest pain and shortness of breath",
    "notes": null,
    "created_at": "2026-03-20T10:30:45Z",
    "updated_at": "2026-03-20T10:30:45Z"
  }
]
```

---

### 5. **Get Today's Appointments**
**Retrieve appointments scheduled for today (Doctor only)**

- **Endpoint:** `GET /doctor/today/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /doctor/today/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 105,
    "patient": 12,
    "patient_details": {...},
    "time_slot": {...},
    "doctor_name": "Dr. John Smith",
    "appointment_date": "2026-03-20",
    "appointment_time": "10:00:00 - 10:15:00",
    "status": "confirmed",
    "symptoms": "Follow-up consultation",
    "notes": null,
    "created_at": "2026-03-19T14:00:00Z",
    "updated_at": "2026-03-19T14:00:00Z"
  },
  {
    "id": 106,
    "patient": 13,
    "patient_details": {...},
    "appointment_date": "2026-03-20",
    "appointment_time": "14:30:00 - 14:45:00",
    "status": "pending",
    "symptoms": "Chest discomfort",
    "notes": null
  }
]
```

---

### 6. **Update Appointment Status**
**Update the status of an appointment (Doctor only)**

- **Endpoint:** `PATCH /doctor/update-status/<id>/`
- **Permission:** `IsAuthenticated` (Doctor only)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request Body
```json
{
  "status": "confirmed",
  "notes": "Patient has hypertension, prescribed medication. Follow up in 2 weeks."
}
```

#### Response (200 OK)
```json
{
  "id": 101,
  "patient": 10,
  "patient_details": {...},
  "time_slot": {...},
  "doctor_name": "Dr. John Smith",
  "appointment_date": "2026-03-25",
  "appointment_time": "09:30:00 - 09:45:00",
  "status": "confirmed",
  "symptoms": "Chest pain and shortness of breath",
  "notes": "Patient has hypertension, prescribed medication. Follow up in 2 weeks.",
  "created_at": "2026-03-20T10:30:45Z",
  "updated_at": "2026-03-20T14:15:30Z"
}
```

#### Error Responses
- **404 Not Found:** Appointment not found
- **403 Forbidden:** Doctor can only update their own appointments
  ```json
  {
    "error": "You can only update your own appointments"
  }
  ```
- **400 Bad Request:** Invalid status
  ```json
  {
    "status": ["Invalid status. Choose from: pending, confirmed, completed, cancelled"]
  }
  ```

#### Valid Status Transitions
```
pending → confirmed → completed
pending → cancelled
confirmed → completed
confirmed → cancelled
```

---

## 🔗 COMMON ENDPOINTS

### 7. **Get Upcoming Appointments**
**Get all upcoming appointments for the current user**

- **Endpoint:** `GET /upcoming/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /upcoming/?ordering=date&limit=10
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 101,
    "patient": 10,
    "doctor_name": "Dr. John Smith",
    "appointment_date": "2026-03-25",
    "appointment_time": "09:30:00 - 09:45:00",
    "status": "confirmed",
    "symptoms": "Chest pain",
    "created_at": "2026-03-20T10:30:45Z"
  },
  {
    "id": 102,
    "patient": 10,
    "doctor_name": "Dr. Jane Jones",
    "appointment_date": "2026-03-28",
    "appointment_time": "14:00:00 - 14:15:00",
    "status": "pending",
    "symptoms": "Skin rash",
    "created_at": "2026-03-19T15:20:30Z"
  }
]
```

#### Filter
Returns only appointments with date >= today

---

### 8. **Get Appointment Details**
**Get detailed information about a specific appointment**

- **Endpoint:** `GET /<id>/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /101/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "id": 101,
  "patient": 10,
  "patient_details": {
    "id": 10,
    "username": "john_patient",
    "email": "john@example.com",
    "user_type": "patient",
    "phone_number": "+1234567890",
    "profile_pic": null
  },
  "time_slot": {
    "id": 301,
    "doctor": 1,
    "doctor_name": "Dr. John Smith",
    "doctor_specialization": "Cardiology",
    "date": "2026-03-25",
    "day": "Wednesday",
    "start_time": "09:30:00",
    "end_time": "09:45:00",
    "slot_number": 3,
    "slot_duration": 15,
    "is_booked": true
  },
  "doctor_name": "Dr. John Smith",
  "doctor_specialization": "Cardiology",
  "appointment_date": "2026-03-25",
  "appointment_time": "09:30:00 - 09:45:00",
  "status": "confirmed",
  "symptoms": "Chest pain and shortness of breath",
  "notes": "Patient has hypertension",
  "created_at": "2026-03-20T10:30:45Z",
  "updated_at": "2026-03-20T14:15:30Z"
}
```

#### Error Responses
- **404 Not Found:** Appointment not found
- **403 Forbidden:** Patient/Doctor can only view their own appointments

---

### 9. **Check Slot Availability**
**Check if a specific time slot is available**

- **Endpoint:** `GET /check-slot/<slot_id>/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
GET /check-slot/301/
Authorization: Token abc123token456
```

#### Response (200 OK) - Available
```json
{
  "slot_id": 301,
  "doctor": 1,
  "doctor_name": "Dr. John Smith",
  "date": "2026-03-25",
  "start_time": "09:30:00",
  "end_time": "09:45:00",
  "is_available": true,
  "message": "Slot is available for booking"
}
```

#### Response (200 OK) - Not Available
```json
{
  "slot_id": 301,
  "doctor": 1,
  "date": "2026-03-25",
  "start_time": "09:30:00",
  "is_available": false,
  "message": "Slot is already booked",
  "booked_by": "john_patient",
  "booked_at": "2026-03-19T15:20:30Z"
}
```

#### Error Responses
- **404 Not Found:** Slot not found

---

### 10. **Get Available Slots for Doctor**
**Get all available slots for a specific doctor (Patient view)**

- **Endpoint:** `GET /doctor/<doctor_id>/available-slots/`
- **Permission:** `IsAuthenticated`
- **Authentication Header:** `Authorization: Token <token>`

#### Query Parameters (Optional)
```
?date=2026-03-25&date_from=2026-03-25&date_to=2026-03-31
```

#### Request
```
GET /doctor/1/available-slots/?date=2026-03-25
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
[
  {
    "id": 301,
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
    "id": 302,
    "doctor": 1,
    "doctor_name": "Dr. John Smith",
    "date": "2026-03-25",
    "start_time": "09:30:00",
    "end_time": "09:45:00",
    "slot_number": 3,
    "slot_duration": 15,
    "is_booked": false
  }
]
```

---

## 📊 Data Models

### Appointment Model
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Appointment ID |
| `patient` | ForeignKey | Yes | Patient user reference |
| `time_slot` | OneToOne | Yes | TimeSlot reference |
| `status` | Choice | Auto | pending/confirmed/completed/cancelled |
| `symptoms` | TextField | Yes | Patient's symptoms |
| `notes` | TextField | No | Doctor's notes |
| `created_at` | DateTime | Auto | Appointment creation time |
| `updated_at` | DateTime | Auto | Last modification time |

---

## 📝 Example Usage (cURL)

### Book an Appointment
```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token abc123token456" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "date": "2026-03-25",
    "slot_number": 3,
    "symptoms": "Chest pain and shortness of breath"
  }'
```

### Get Patient's Appointments
```bash
curl -X GET http://localhost:8000/api/appointments/my-appointments/ \
  -H "Authorization: Token abc123token456"
```

### Cancel Appointment
```bash
curl -X DELETE http://localhost:8000/api/appointments/cancel/101/ \
  -H "Authorization: Token abc123token456"
```

### Get Doctor's Today's Appointments
```bash
curl -X GET http://localhost:8000/api/appointments/doctor/today/ \
  -H "Authorization: Token abc123token456"
```

### Update Appointment Status
```bash
curl -X PATCH http://localhost:8000/api/appointments/doctor/update-status/101/ \
  -H "Authorization: Token abc123token456" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Confirmed appointment"
  }'
```

---

## ⚠️ Common Errors & Troubleshooting

| Status | Error | Solution |
|--------|-------|----------|
| 403 | Only patients can book appointments | Ensure user is registered as patient |
| 400 | Slot not available | Choose a different slot or date |
| 400 | Date in past | Use future dates |
| 404 | Appointment not found | Verify appointment ID |
| 403 | Cannot cancel appointment | Appointment may be already completed |
| 400 | Already has appointment at this time | Choose different time slot |

---

## 🔄 Appointment Lifecycle

```
1. Patient Books Appointment
   ├─ Status: pending
   ├─ TimeSlot is marked as booked
   └─ Appointment created
   
2. Doctor Updates Status
   ├─ Status: pending → confirmed → completed
   └─ Can add notes
   
3. Appointment Completion
   ├─ Status: completed
   └─ Historical record maintained
   
OR

2. Cancellation
   ├─ Status: cancelled
   ├─ TimeSlot marked as unbooked
   └─ Slot available again
```

---

## 🎯 Key Features

✅ **Double-Booking Prevention** - Patient cannot book same slot twice  
✅ **Time Validation** - Cannot book past time slots  
✅ **Doctor Notes** - Doctor can add clinical notes after appointment  
✅ **Status Tracking** - Complete appointment lifecycle management  
✅ **Slot Management** - Automatic slot availability updates  
✅ **History Retention** - All appointments are kept for records  

---
