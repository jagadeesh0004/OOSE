# 📚 Health Predictor - Complete Testing Documentation Index

## Overview

I've created **three comprehensive testing documents** to help you test all features of the Health Predictor application end-to-end.

---

## 📖 Document Guide

### 1. **POSTMAN_COMPLETE_TESTING_GUIDE.md** ⭐ (RECOMMENDED)
**Best for:** Complete end-to-end testing with detailed examples

**What's included:**
- ✅ Environment setup (5-minute setup)
- ✅ Complete Patient Journey (7 steps)
- ✅ Complete Doctor Journey (10 steps)
- ✅ Error scenarios & edge cases
- ✅ All API endpoints organized by module
- ✅ Postman test scripts (JavaScript)
- ✅ Automatic token extraction
- ✅ Response validation
- ✅ Testing checklist

**Use this if:** You want the most detailed guides with everything explained step-by-step

**File location:** `c:\Users\18080\OOSE\POSTMAN_COMPLETE_TESTING_GUIDE.md`

---

### 2. **POSTMAN_SETUP_AND_CONFIGURATION.md**
**Best for:** Quick setup and technical reference

**What's included:**
- ✅ 5-minute quick start
- ✅ Environment variables setup
- ✅ Collection folder structure
- ✅ Pre-request scripts
- ✅ Authorization setup
- ✅ Common test scripts
- ✅ Complete request examples
- ✅ Running collections
- ✅ Debugging tips
- ✅ Troubleshooting guide

**Use this if:** You want quick reference and setup instructions

**File location:** `c:\Users\18080\OOSE\POSTMAN_SETUP_AND_CONFIGURATION.md`

---

### 3. **CURL_COMMANDS_API_TESTING.md**
**Best for:** Command-line testing, automation, CI/CD integration

**What's included:**
- ✅ Copy-paste curl commands for all endpoints
- ✅ All authentication tests
- ✅ Doctor management tests
- ✅ Appointment booking tests
- ✅ Health prediction tests
- ✅ Error scenario tests
- ✅ Bash script for testing
- ✅ Performance testing commands
- ✅ Continuous testing loops

**Use this if:** You prefer command-line testing or need to automate testing

**File location:** `c:\Users\18080\OOSE\CURL_COMMANDS_API_TESTING.md`

---

## 🚀 Quick Start (Choose Your Path)

### Path A: GUI Testing (Postman Desktop App)
1. Download Postman from posttman.com
2. Read: **POSTMAN_SETUP_AND_CONFIGURATION.md** (5 min setup)
3. Follow: **POSTMAN_COMPLETE_TESTING_GUIDE.md** (detailed tests)
4. Use **Postman Environment Variables** to save tokens

### Path B: Command-Line Testing (cURL)
1. Open PowerShell/Terminal
2. Copy commands from: **CURL_COMMANDS_API_TESTING.md**
3. Replace placeholders with your values
4. Run tests

### Path C: Automated Testing (Bash Script)
1. See **CURL_COMMANDS_API_TESTING.md** section "Bash Script for Complete Testing"
2. Create `test_api.sh` file with provided script
3. Run: `bash test_api.sh`

---

## 🎯 Testing Scenarios

All three documents cover these scenarios:

### ✅ Patient Workflow
```
Register → Login → Browse Doctors → View Slots → Book Appointment 
→ View Appointments → Make Health Prediction
```

### ✅ Doctor Workflow
```
Register → Create Profile → Generate Slots → View Appointments 
→ Update Status → Manage Slots
```

### ✅ Error Cases
```
Invalid Auth → Wrong Role → Duplicate Data → Past Dates 
→ Invalid Input → Missing Fields
```

---

## 📋 Key Information

### Backend Server
**Status:** ✅ **Currently running on port 8000**
- URL: `http://localhost:8000`
- API Base: `http://localhost:8000/api`

### User Types Supported
1. **Patient** - Can book appointments, view health predictions
2. **Doctor** - Can create profile, manage slots, update appointment status
3. **Admin** - (Optional) Full access

### Authentication Method
- **Type:** Token-based
- **Header Format:** `Authorization: Token abc123token`
- **Persistence:** Token valid until logout

### Main API Modules
1. **Accounts** (`/api/accounts/`) - Registration, Login, Profile
2. **Doctors** (`/api/doctors/`) - Doctor profiles, Time slots
3. **Appointments** (`/api/appointments/`) - Booking, Management
4. **Predictions** (`/api/predictions/`) - Health risk assessment

---

## 🔑 API Authentication Keys

### Register (No Auth Required)
```json
{
  "username": "unique_username",
  "email": "unique@email.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient|doctor",
  "phone_number": "+1234567890"
}
```

### Login Response (Get Token)
```json
{
  "user": {...},
  "token": "YOUR_TOKEN_HERE",
  "message": "Login successful"
}
```

### Use Token in All Protected Endpoints
```
Authorization: Token YOUR_TOKEN_HERE
Content-Type: application/json
```

---

## 📊 Testing Coverage Matrix

| Feature | Postman Guide | Setup Guide | cURL Guide |
|---------|---------------|-------------|-----------|
| Patient Registration | ✅ | ✅ | ✅ |
| Doctor Registration | ✅ | ✅ | ✅ |
| Authentication | ✅ | ✅ | ✅ |
| Doctor Profiles | ✅ | ✅ | ✅ |
| Time Slot Management | ✅ | ✅ | ✅ |
| Appointment Booking | ✅ | ✅ | ✅ |
| Appointment Management | ✅ | ✅ | ✅ |
| Health Predictions | ✅ | ✅ | ✅ |
| Error Scenarios | ✅ | ✅ | ✅ |
| Automation Scripts | ❌ | ✅ | ✅ |

---

## ⏱️ Testing Timeline

### Quick Test (15 minutes)
1. Register as patient
2. View available doctors
3. Book appointment
4. Cancel appointment

### Standard Test (45 minutes)
1. Register patient & doctor
2. Create doctor profile
3. Generate time slots
4. Patient books appointment
5. Doctor views and updates appointment
6. Patient makes health prediction

### Comprehensive Test (2 hours)
1. Complete patient journey (above)
2. Complete doctor journey
3. All error scenarios
4. Edge cases
5. Performance verification
6. Data validation

---

## 🛠️ Tools Required

### Minimum (Any one)
- **Option 1:** Postman (GUI) - Recommended for beginners
- **Option 2:** curl (CLI) - Built into most systems
- **Option 3:** Browser Extensions - Postman Web or similar

### Optional
- **Advanced:** Python requests library, API testing frameworks
- **CI/CD:** GitHub Actions, Jenkins with curl scripts

---

## 📋 Testing Checklist

Before declaring testing complete:

### ✅ Core Features Tested
- [ ] Patient registration & login
- [ ] Doctor registration & profile creation
- [ ] Time slot generation & management
- [ ] Appointment booking by patient
- [ ] Appointment status updates by doctor
- [ ] Health prediction generation
- [ ] Doctor recommendations for high-risk patients

### ✅ Error Handling Tested
- [ ] Invalid credentials
- [ ] Missing authentication token
- [ ] Wrong user role attempting wrong action
- [ ] Duplicate entries rejected
- [ ] Past date appointments rejected
- [ ] Double booking prevention
- [ ] Invalid data rejected

### ✅ Data Validation Tested
- [ ] All required fields validated
- [ ] Email format validation
- [ ] Phone number format validation
- [ ] Password strength validation
- [ ] Health metrics range validation
- [ ] Date format validation
- [ ] Time format validation

### ✅ Performance Tested
- [ ] Response times < 500ms
- [ ] Large data sets handled
- [ ] Pagination working
- [ ] Filtering working
- [ ] Sorting working

---

## 🔗 API Endpoint Summary

### Accounts (7 endpoints)
```
POST   /api/accounts/register/           - Register new user
POST   /api/accounts/login/              - User login
GET    /api/accounts/profile/            - Get profile
PUT    /api/accounts/profile/            - Update profile
POST   /api/accounts/logout/             - Logout
```

### Doctors (13 endpoints)
```
POST   /api/doctors/create-profile/      - Create doctor profile
GET    /api/doctors/check-profile/       - Check if profile exists
GET    /api/doctors/my-profile/          - Get own profile
PUT    /api/doctors/update-profile/      - Update profile
POST   /api/doctors/generate-slots/      - Generate time slots
GET    /api/doctors/my-slots/            - View slots
POST   /api/doctors/add-slot/            - Add single slot
DELETE /api/doctors/delete-slot/ID       - Delete specific slot
GET    /api/doctors/list/                - List all doctors
GET    /api/doctors/ID                   - Get doctor details
GET    /api/doctors/ID/available-slots/  - Get available slots
```

### Appointments (9 endpoints)
```
POST   /api/appointments/book/           - Book appointment
GET    /api/appointments/my-appointments/ - Get patient appointments
DELETE /api/appointments/cancel/ID       - Cancel appointment
GET    /api/appointments/doctor/appointments/ - Get doctor appointments
GET    /api/appointments/doctor/today/   - Get today's appointments
PATCH  /api/appointments/doctor/update-status/ID - Update status
GET    /api/appointments/upcoming/       - Get upcoming appointments
GET    /api/appointments/ID              - Get appointment details
GET    /api/appointments/check-slot/ID   - Check slot availability
```

### Predictions (3 endpoints)
```
POST   /api/predictions/predict/         - Make prediction
GET    /api/predictions/history/         - Get prediction history
GET    /api/predictions/ID               - Get specific prediction
```

**Total: 32 API endpoints to test**

---

## 🆘 Troubleshooting

### Backend Server Not Running?
```bash
cd c:\Users\18080\OOSE\Health_Predictor\health_predictor
python manage.py runserver
```

### Access Rights Issues?
- Ensure user_type is correct (patient vs doctor)
- Check token is still valid
- Re-login if token expired

### Data Not Appearing?
- Make sure you're using correct token for user
- Verify database migrations ran: `python manage.py migrate`
- Check environment variables are set in Postman

### Postman Not Working?
- Verify base_url in environment: `http://localhost:8000`
- Check Authorization header: `Token {{patient_token}}`
- Use "Manage Environments" to verify variables

### cURL Commands Failing?
- Replace placeholders with actual values
- Escape special characters properly
- Use `jsonlint` to validate JSON syntax

---

## 📞 Quick Reference

| Need | Document | Section |
|------|----------|---------|
| Setup | Setup & Configuration | "Quick Start: 5-Min Setup" |
| Postman Tests | Complete Testing Guide | "Complete End-to-End Test Scenarios" |
| Command Line Tests | cURL Guide | "Quick Reference: Copy & Paste" |
| Environment Setup | Setup & Configuration | "Pre-request Scripts" |
| Error Handling | Complete Testing Guide | "Error Handling & Troubleshooting" |
| Test Scripts | Setup & Configuration | "Common Test Scripts" |
| Performance | cURL Guide | "Performance Testing" |
| Automation | cURL Guide | "Bash Script for Complete Testing" |

---

## 📝 Test Results Template

```
Testing Date: March 21, 2026
Backend Version: Latest
Tester: [Your Name]

TEST RESULTS:
=============
Total Endpoints: 32
✅ Passed: [#]
❌ Failed: [#]
⚠️ Warnings: [#]

MODULES:
- Accounts: [✅/❌]
- Doctors: [✅/❌]
- Appointments: [✅/❌]
- Predictions: [✅/❌]

STATUS: [PASSED/FAILED]
```

---

## 🎓 Learning Path

1. **Beginner:** Start with POSTMAN_SETUP_AND_CONFIGURATION.md
2. **Intermediate:** Study POSTMAN_COMPLETE_TESTING_GUIDE.md thoroughly
3. **Advanced:** Script tests using CURL_COMMANDS_API_TESTING.md
4. **Expert:** Create CI/CD pipeline with automated testing

---

## 📚 Additional Resources

Each document includes:
- Detailed examples
- Expected responses
- Error messages
- Test validations
- Troubleshooting tips
- Best practices

Open **POSTMAN_COMPLETE_TESTING_GUIDE.md** to begin comprehensive testing!

---

**Ready to test? Start here:**

```
✅ Backend is running on http://localhost:8000
✅ Three complete testing guides created
✅ All API endpoints documented
✅ Step-by-step examples provided
```

**Choose your testing method and begin!**

---

*Last Updated: March 21, 2026*
*All documents are ready for immediate use*
