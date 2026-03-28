# 🏥 Health Predictor API - Complete Documentation Index

## 📚 Overview

The **Health Predictor** is a comprehensive Django REST Framework backend that combines:
- 🔐 **User Authentication** (Accounts)
- 🧑‍⚕️ **Doctor Management** (Doctors)
- 📅 **Appointment Booking** (Appointments)
- 🧠 **Health Risk Prediction using ML** (Predictions)

---

## 🗂️ Documentation Structure

### [1️⃣ Accounts API](01_ACCOUNTS_API.md)
**User Authentication & Profile Management**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/register/` | POST | Create new user (Patient/Doctor) |
| `/login/` | POST | Authenticate user & get token |
| `/profile/` | GET/PUT | View/Update user profile |
| `/logout/` | POST | Invalidate authentication token |

**Key Features:**
- Token-based authentication
- User registration with validation
- Profile management
- Support for patient and doctor roles

**Learn More:** [Read Full Documentation](01_ACCOUNTS_API.md)

---

### [2️⃣ Doctors API](02_DOCTORS_API.md)
**Doctor Profiles & Time Slot Management**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| **Profile Management** | | |
| `/create-profile/` | POST | Create doctor profile |
| `/check-profile/` | GET | Check if profile exists |
| `/my-profile/` | GET | Get doctor's own profile |
| `/update-profile/` | PUT | Update profile information |
| **Slot Management** | | |
| `/generate-slots/` | POST | Auto-generate time slots |
| `/my-slots/` | GET | View doctor's slots |
| `/add-slot/` | POST | Add single slot |
| `/delete-slot/<id>/` | DELETE | Delete specific slot |
| `/delete-slot/` | DELETE | Delete slots by date |
| `/delete-all-slots/` | DELETE | Delete all slots |
| **Public Endpoints** | | |
| `/list/` | GET | List all available doctors |
| `/<id>/` | GET | Get doctor details |
| `/<doctor_id>/available-slots/` | GET | Get doctor's available slots |

**Key Features:**
- Doctor profile creation with specialization
- Automatic time slot generation
- Manual slot management
- Patient browsing (public endpoints)

**Learn More:** [Read Full Documentation](02_DOCTORS_API.md)

---

### [3️⃣ Appointments API](03_APPOINTMENTS_API.md)
**Doctor Appointment Booking System**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| **Patient Endpoints** | | |
| `/book/` | POST | Book appointment with doctor |
| `/my-appointments/` | GET | View patient's appointments |
| `/cancel/<id>/` | DELETE | Cancel appointment |
| **Doctor Endpoints** | | |
| `/doctor/appointments/` | GET | View all doctor's appointments |
| `/doctor/today/` | GET | View today's appointments |
| `/doctor/update-status/<id>/` | PATCH | Update appointment status |
| **Common Endpoints** | | |
| `/upcoming/` | GET | Get upcoming appointments |
| `/<id>/` | GET | Get appointment details |
| `/check-slot/<slot_id>/` | GET | Check slot availability |
| `/doctor/<doctor_id>/available-slots/` | GET | Get doctor's available slots |

**Key Features:**
- Patient appointment booking
- Double-booking prevention
- Status tracking (pending → confirmed → completed)
- Doctor notes management
- Real-time slot availability

**Learn More:** [Read Full Documentation](03_APPOINTMENTS_API.md)

---

### [4️⃣ Predictions API](04_PREDICTIONS_API.md)
**AI/ML-Based Health Risk Prediction**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/predict/` | POST | Make health prediction |
| `/history/` | GET | Get prediction history |
| `/<id>/` | GET | Get specific prediction |

**Key Features:**
- ML-based health risk classification
- Risk level: low/medium/high
- Personalized prescriptions
- Automatic doctor recommendations (high-risk)
- Complete prediction history
- 10 health metrics analysis

**Learn More:** [Read Full Documentation](04_PREDICTIONS_API.md)

---

## 🔄 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│           HEALTH PREDICTOR BACKEND SYSTEM                │
└─────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐    ┌──────▼────────┐   ┌────▼──────┐
    │ ACCOUNTS │    │   DOCTORS     │   │   MODELS  │
    │ API      │    │   API         │   │  (Django) │
    ├──────────┤    ├───────────────┤   └───────────┘
    │Register  │    │Doctor Profile │
    │Login     │    │Time Slots     │   ┌──────────────┐
    │Profile   │    │Slot Mgmt      │   │ PREDICTIONS │
    │Logout    │    │Public Listing │   │ API          │
    └─────┬────┘    └───────┬───────┘   ├──────────────┤
          │                 │            │ML Prediction │
          │                 │            │Prescription  │
          │   ┌─────────────▼────────┐   │History Mgmt  │
          └──▶│  APPOINTMENTS API    │   └──────────────┘
              ├──────────────────────┤
              │Book Appointment      │
              │Manage Appointments   │
              │Status Updates        │
              │Slot Linking          │
              └──────────────────────┘
```

---

## 🔐 Authentication Flow

```
1. User Registration (POST /register/)
   └─→ Returns: User Data + Auth Token
   
2. User Login (POST /login/)
   └─→ Returns: User Data + Auth Token
   
3. Use Token for All Authenticated Requests
   └─→ Header: Authorization: Token <token>
   
4. Logout (POST /logout/)
   └─→ Token becomes invalid
```

---

## 👥 User Roles & Permissions

### Patient Role
```
✅ Can:
  • Register as patient
  • View profile
  • Browse available doctors
  • Book appointments
  • Cancel appointments
  • View appointments history
  • Make health predictions
  • View prediction history

❌ Cannot:
  • Create doctor profile
  • Manage time slots
  • View other patients' data
  • Update appointment status (limited)
```

### Doctor Role
```
✅ Can:
  • Register as doctor
  • Create doctor profile
  • Generate and manage time slots
  • View all their appointments
  • View today's appointments
  • Update appointment status
  • Add clinical notes

❌ Cannot:
  • Book appointments
  • Make health predictions
  • View other doctors' private data
```

---

## 🔌 Base URLs

```
Development:  http://localhost:8000/api/
Production:   https://api.example.com/api/
```

### API Endpoints
```
/api/accounts/      → Authentication & Profile
/api/doctors/       → Doctor Management
/api/appointments/  → Appointment Booking
/api/predictions/   → Health Predictions
```

---

## 📊 Database Relationships

```
User (with user_type: patient/doctor)
  ├─→ PatientProfile (if patient)
  │    └─→ Appointments
  │         └─→ TimeSlot
  │
  └─→ DoctorProfile (if doctor)
       └─→ TimeSlots
            └─→ Appointments

HealthPrediction
  └─→ User (patient only)
```

---

## 🚀 Common Workflows

### Workflow 1: Patient Books Appointment
```
1. Patient registers → Get token
2. Browse doctors (/api/doctors/list/)
3. View doctor slots (/api/doctors/{id}/available-slots/)
4. Book appointment (/api/appointments/book/)
5. Get appointment details (/api/appointments/{id}/)
```

### Workflow 2: Doctor Sets Up Practice
```
1. Doctor registers → Get token
2. Create doctor profile (/api/doctors/create-profile/)
3. Generate time slots (/api/doctors/generate-slots/)
4. View today's appointments (/api/appointments/doctor/today/)
5. Update appointment status (/api/appointments/doctor/update-status/{id}/)
```

### Workflow 3: Patient Gets Health Prediction
```
1. Patient registers → Get token
2. Provide health metrics (/api/predictions/predict/)
3. Get risk assessment & prescription
4. View prediction history (/api/predictions/history/)
5. For high-risk: Book appointment with recommended doctor
```

---

## 🔍 Request Headers

### For All Authenticated Endpoints
```
Authorization: Token <your_token>
Content-Type: application/json
```

### Example
```bash
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token abc123token456" \
  -H "Content-Type: application/json"
```

---

## 📝 Response Format

### Success Response (200, 201)
```json
{
  "data": {...},
  "message": "Success message",
  "status": "success"
}
```

### Error Response (400, 401, 403, 404, 500)
```json
{
  "error": "Error description",
  "details": {...}
}
```

---

## ⏱️ Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## 🎯 Key Features Summary

### Accounts
✅ User registration with validation  
✅ Token-based authentication  
✅ Profile management  
✅ Two roles: patient & doctor  

### Doctors
✅ Doctor profile management  
✅ Automatic slot generation  
✅ Flexible slot management  
✅ Public doctor listing  

### Appointments
✅ Easy appointment booking  
✅ Double-booking prevention  
✅ Status tracking system  
✅ Doctor clinical notes  
✅ Appointment history  

### Predictions
✅ ML-based risk assessment  
✅ Personalized prescriptions  
✅ Doctor recommendations  
✅ Health metrics tracking  
✅ Prediction history  

---

## 📈 Data Flow

```
Patient Input
    │
    ▼
Validation
    │
    ▼
Processing
    │
    ├─→ Accounts: Auth/Profile
    ├─→ Doctors: Profile/Slots
    ├─→ Appointments: Booking
    ├─→ Predictions: ML Analysis
    │
    ▼
Database Storage
    │
    ▼
Response to Client
```

---

## 🛡️ Security Features

✅ **Token Authentication** - Secure API access  
✅ **Role-Based Access** - Patient/Doctor specific endpoints  
✅ **Input Validation** - All inputs validated  
✅ **Password Hashing** - Secure password storage  
✅ **HTTPS Support** - Encrypted communication  
✅ **Permissions Check** - Endpoint-level authorization  

---

## 📱 API Testing Tools

Recommended tools for API testing:
- **Postman** - GUI tool for API testing
- **cURL** - Command-line tool
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension
- **Swagger UI** - API documentation

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check if token is included in header |
| 403 Forbidden | Verify user role (patient/doctor) |
| 400 Bad Request | Validate input data format |
| 404 Not Found | Verify resource ID exists |
| Double booking | System prevents this automatically |

---

## 🔗 Related Documentation

- [Accounts API - Complete Guide](01_ACCOUNTS_API.md)
- [Doctors API - Complete Guide](02_DOCTORS_API.md)
- [Appointments API - Complete Guide](03_APPOINTMENTS_API.md)
- [Predictions API - Complete Guide](04_PREDICTIONS_API.md)

---

## 💼 Use Cases

### For Patients
1. Register and create account
2. Browse and find doctors
3. Check available appointment slots
4. Book appointments
5. Manage appointments (view, cancel)
6. Get health risk predictions
7. Track health history

### For Doctors
1. Register and create account
2. Set up doctor profile
3. Generate available time slots
4. View appointments schedule
5. Manage (confirm/complete) appointments
6. Add clinical notes

### For Administrators
1. Monitor system usage
2. View user analytics
3. Manage users and doctors

---

## 🚀 Getting Started

1. **Installation**: Follow README in project root
2. **Setup**: Run migrations and create superuser
3. **Start Server**: `python manage.py runserver`
4. **Test API**: Use provided curl commands or Postman
5. **Read Docs**: Refer to specific API documentation

---

## 📞 Support

For detailed endpoint documentation:
- See individual API documentation files
- Each file contains complete request/response examples
- Error handling and validations explained
- Common use cases provided

---

## 📋 Quick Reference

### Authentication
```bash
# Register
POST /api/accounts/register/

# Login
POST /api/accounts/login/

# Get Profile
GET /api/accounts/profile/
Header: Authorization: Token <token>
```

### Doctors
```bash
# Create Profile
POST /api/doctors/create-profile/
Header: Authorization: Token <token>

# Generate Slots
POST /api/doctors/generate-slots/
Header: Authorization: Token <token>

# List Doctors
GET /api/doctors/list/
Header: Authorization: Token <token>
```

### Appointments
```bash
# Book Appointment
POST /api/appointments/book/
Header: Authorization: Token <token>

# Get My Appointments
GET /api/appointments/my-appointments/
Header: Authorization: Token <token>

# Doctor's Today Appointments
GET /api/appointments/doctor/today/
Header: Authorization: Token <token>
```

### Predictions
```bash
# Make Prediction
POST /api/predictions/predict/
Header: Authorization: Token <token>

# Get Prediction History
GET /api/predictions/history/
Header: Authorization: Token <token>
```

---

## 🎓 API Maturity Level

| Module | Status | Stability |
|--------|--------|-----------|
| Accounts | ✅ Production | Stable |
| Doctors | ✅ Production | Stable |
| Appointments | ✅ Production | Stable |
| Predictions | ✅ Production | Stable |

---

**Last Updated:** March 20, 2026  
**API Version:** 1.0  
**Documentation Version:** 1.0  

---
