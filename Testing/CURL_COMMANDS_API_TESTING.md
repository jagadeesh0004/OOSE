# 🔧 Quick cURL Commands for API Testing

## Quick Reference: Copy & Paste Commands

### ⚠️ Important
Replace these placeholders before running:
- `{{BASE_URL}}` → `http://localhost:8000`
- `{{PATIENT_TOKEN}}` → Your patient token
- `{{DOCTOR_TOKEN}}` → Your doctor token
- `{{DOCTOR_ID}}` → ID of a doctor
- `{{APPOINTMENT_ID}}` → ID of an appointment
- `{{TIMESTAMP}}` → Current timestamp (e.g., 1234567890)

---

## 1️⃣ AUTHENTICATION TESTS

### Register Patient

```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient_john_'$(date +%s)'",
    "email": "patient_'$(date +%s)'@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "+1234567890"
  }'
```

**Save the returned token for use in other requests:**
```bash
PATIENT_TOKEN="your_token_here"
```

---

### Register Doctor

```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_smith_'$(date +%s)'",
    "email": "dr_smith_'$(date +%s)'@hospital.com",
    "password": "DoctorPass123!",
    "password2": "DoctorPass123!",
    "first_name": "John",
    "last_name": "Smith",
    "user_type": "doctor",
    "phone_number": "+0987654321"
  }'
```

**Save the returned token:**
```bash
DOCTOR_TOKEN="your_token_here"
```

---

### Login Patient

```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient_john_1234567890",
    "password": "SecurePass123!"
  }'
```

---

### Login Doctor

```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_smith_1234567890",
    "password": "DoctorPass123!"
  }'
```

---

### Get Patient Profile

```bash
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Update Patient Profile

```bash
curl -X PUT http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new_email@example.com",
    "phone_number": "+9876543210"
  }'
```

---

### Logout

```bash
curl -X POST http://localhost:8000/api/accounts/logout/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

## 2️⃣ DOCTOR MANAGEMENT TESTS

### Create Doctor Profile

```bash
curl -X POST http://localhost:8000/api/doctors/create-profile/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

---

### Check Doctor Profile

```bash
curl -X GET http://localhost:8000/api/doctors/check-profile/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Doctor's Own Profile

```bash
curl -X GET http://localhost:8000/api/doctors/my-profile/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Update Doctor Profile

```bash
curl -X PUT http://localhost:8000/api/doctors/update-profile/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "consultation_fee": 600.00,
    "hospital_name": "New City Hospital",
    "is_available": true
  }'
```

---

### List All Doctors

```bash
curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Doctor Details

```bash
curl -X GET http://localhost:8000/api/doctors/1/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Generate Time Slots

```bash
curl -X POST http://localhost:8000/api/doctors/generate-slots/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-03-22",
    "end_date": "2026-04-30",
    "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "time_slots": [
      {"start": "09:00", "end": "12:00"},
      {"start": "14:00", "end": "17:00"}
    ],
    "slot_duration": 15
  }'
```

---

### View Doctor's Slots

```bash
curl -X GET "http://localhost:8000/api/doctors/my-slots/?date=2026-03-25" \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Available Slots for Doctor

```bash
curl -X GET "http://localhost:8000/api/doctors/{{DOCTOR_ID}}/available-slots/?date=2026-03-25" \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Add Single Time Slot

```bash
curl -X POST http://localhost:8000/api/doctors/add-slot/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-30",
    "start_time": "10:00",
    "end_time": "11:00",
    "slot_number": 5
  }'
```

---

### Delete Specific Slot

```bash
curl -X DELETE http://localhost:8000/api/doctors/delete-slot/101/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Delete All Slots by Date

```bash
curl -X DELETE http://localhost:8000/api/doctors/delete-slot/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-25"
  }'
```

---

### Delete All Slots

```bash
curl -X DELETE http://localhost:8000/api/doctors/delete-all-slots/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

## 3️⃣ APPOINTMENT TESTS

### Book Appointment

```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "date": "2026-03-25",
    "slot_number": 1,
    "symptoms": "Chest pain and shortness of breath"
  }'
```

---

### Get Patient's Appointments

```bash
curl -X GET http://localhost:8000/api/appointments/my-appointments/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Patient's Appointments (Filtered)

```bash
curl -X GET "http://localhost:8000/api/appointments/my-appointments/?status=pending&ordering=-date" \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Cancel Appointment

```bash
curl -X DELETE http://localhost:8000/api/appointments/cancel/101/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Doctor's Appointments

```bash
curl -X GET http://localhost:8000/api/appointments/doctor/appointments/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Today's Appointments (Doctor)

```bash
curl -X GET http://localhost:8000/api/appointments/doctor/today/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Update Appointment Status

```bash
curl -X PATCH http://localhost:8000/api/appointments/doctor/update-status/101/ \
  -H "Authorization: Token {{DOCTOR_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Patient appeared with all required documents"
  }'
```

---

### Get Appointment Details

```bash
curl -X GET http://localhost:8000/api/appointments/101/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Upcoming Appointments

```bash
curl -X GET http://localhost:8000/api/appointments/upcoming/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Check Slot Availability

```bash
curl -X GET http://localhost:8000/api/appointments/check-slot/101/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

## 4️⃣ HEALTH PREDICTION TESTS

### Make Health Prediction (Low Risk)

```bash
curl -X POST http://localhost:8000/api/predictions/predict/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
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
    "smoking": "no",
    "alcohol": "no"
  }'
```

---

### Make Health Prediction (High Risk)

```bash
curl -X POST http://localhost:8000/api/predictions/predict/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 65,
    "gender": "male",
    "weight": 95,
    "height": 170,
    "temperature": 38.5,
    "blood_pressure": 180,
    "sleep": 4,
    "heart_rate": 95,
    "smoking": "yes",
    "alcohol": "yes"
  }'
```

---

### Get Prediction History

```bash
curl -X GET http://localhost:8000/api/predictions/history/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

### Get Specific Prediction

```bash
curl -X GET http://localhost:8000/api/predictions/1/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json"
```

---

## 5️⃣ ERROR SCENARIO TESTS

### Test: Missing Authorization Token

```bash
curl -X GET http://localhost:8000/api/appointments/my-appointments/ \
  -H "Content-Type: application/json"
```

**Expected Error:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### Test: Invalid Token

```bash
curl -X GET http://localhost:8000/api/appointments/my-appointments/ \
  -H "Authorization: Token invalid_token_12345" \
  -H "Content-Type: application/json"
```

**Expected Error:**
```json
{
  "detail": "Invalid token."
}
```

---

### Test: Duplicate Username Registration

```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient_john_1234567890",
    "email": "different@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "+1234567890"
  }'
```

**Expected Error:**
```json
{
  "username": ["This field must be unique."]
}
```

---

### Test: Password Mismatch

```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "email": "new@example.com",
    "password": "SecurePass123!",
    "password2": "DifferentPass123!",
    "first_name": "Test",
    "last_name": "User",
    "user_type": "patient",
    "phone_number": "+1234567890"
  }'
```

**Expected Error:**
```json
{
  "password": ["Password fields didn't match."]
}
```

---

### Test: Patient Can't Create Doctor Profile

```bash
curl -X POST http://localhost:8000/api/doctors/create-profile/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Cardiology",
    "qualification": "MD",
    "experience_years": 5,
    "consultation_fee": 500
  }'
```

**Expected Error (403):**
```json
{
  "error": "Only doctors can create doctor profiles"
}
```

---

### Test: Book Appointment in Past

```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "date": "2026-03-20",
    "slot_number": 1,
    "symptoms": "Chest pain"
  }'
```

**Expected Error:**
```json
{
  "date": ["Cannot book appointments for past dates"]
}
```

---

## 🚀 Bash Script for Complete Testing

### Save as: `test_api.sh`

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8000"
API_BASE="$BASE_URL/api"

# Test counters
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local token=$4
    local data=$5
    
    echo -e "${YELLOW}Testing: $name${NC}"
    
    if [ -z "$token" ]; then
        response=$(curl -s -X "$method" "$API_BASE$endpoint" \
          -H "Content-Type: application/json")
    else
        response=$(curl -s -X "$method" "$API_BASE$endpoint" \
          -H "Authorization: Token $token" \
          -H "Content-Type: application/json" \
          -d "$data")
    fi
    
    if echo "$response" | grep -q "error\|detail"; then
        echo -e "${RED}✗ FAILED${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        ((FAILED++))
    else
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    fi
    echo "---"
}

echo -e "${YELLOW}=== Health Predictor API Test Suite ===${NC}\n"

# Test: Register Patient
echo -e "${YELLOW}1. AUTHENTICATION TESTS${NC}"
test_endpoint "Register Patient" "POST" "/accounts/register/" "" '{
  "username": "test_'$(date +%s)'",
  "email": "test_'$(date +%s)'@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "Test",
  "last_name": "User",
  "user_type": "patient",
  "phone_number": "+1234567890"
}'

# Summary
echo -e "\n${YELLOW}=== TEST SUMMARY ===${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
```

### Run the script:

```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 📊 Test Results Tracking

### Create a test results file

```bash
# Save results to file
curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -w "\n\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  | tee test_results.txt
```

---

## ⚡ Performance Testing with curl

### Measure Response Time

```bash
curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token {{PATIENT_TOKEN}}" \
  -w "\n\nResponse Time: %{time_total}s\n" \
  -o /dev/null -s
```

---

## 🔄 Continuous Testing Loop

```bash
#!/bin/bash
# Test every 10 seconds for monitoring

for i in {1..10}; do
  echo "Test iteration $i"
  curl -X GET http://localhost:8000/api/doctors/list/ \
    -H "Authorization: Token {{PATIENT_TOKEN}}" \
    -H "Content-Type: application/json" \
    -w "\nStatus: %{http_code}\n\n"
  sleep 10
done
```

---

**End of cURL Testing Guide**

*Use these commands with various tools or integrate into CI/CD pipelines*
