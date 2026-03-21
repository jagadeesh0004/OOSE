# 📌 Postman Setup & Collection Configuration Guide

## Quick Start: 5-Minute Setup

### Step 1: Create Environment (1 min)

1. Open Postman
2. Click "Environments" (left sidebar)
3. Click "+" or "Create Environment"
4. Name: `Health_Predictor_Local`
5. Add these variables:

```
base_url           | http://localhost:8000
api_base           | {{base_url}}/api
patient_token      | (leave empty - will be set by requests)
doctor_token       | (leave empty - will be set by requests)
patient_id         | (leave empty)
doctor_id          | (leave empty)
appointment_id     | (leave empty)
doctor_profile_id  | (leave empty)
```

6. Save

### Step 2: Create Collection (1 min)

1. Click "Collections" (left sidebar)
2. Click "+" or "Create Collection"
3. Name: `Health_Predictor_API`
4. Description: `Complete API testing for Health Predictor`
5. Save

### Step 3: Set Active Environment (1 min)

1. Top-right dropdown (near send button)
2. Select `Health_Predictor_Local`

### Step 4: Start Adding Requests (2 min)

Done! You're now ready to add API requests.

---

## Folder Structure for Organization

Inside your collection, create these folders:

```
Health_Predictor_API/
├── Authentication
│   ├── Register Patient
│   ├── Register Doctor
│   ├── Login Patient
│   ├── Login Doctor
│   ├── Get Profile
│   ├── Update Profile
│   └── Logout
├── Doctor Management
│   ├── Create Profile
│   ├── Check Profile
│   ├── Get My Profile
│   ├── Update Profile
│   ├── List All Doctors
│   └── Time Slot Management
│       ├── Generate Slots
│       ├── View My Slots
│       ├── Add Slot
│       └── Delete Slot
├── Appointments
│   ├── Book Appointment
│   ├── View My Appointments
│   ├── Cancel Appointment
│   ├── Doctor Appointments
│   ├── Update Appointment Status
│   └── Get Appointment Details
├── Health Predictions
│   ├── Make Prediction
│   ├── View History
│   └── Get Prediction Details
└── Error Scenarios
    ├── Invalid Credentials
    ├── Missing Token
    ├── Permission Denied
    ├── Duplicate Username
    ├── Invalid Data
    └── Double Booking
```

---

## Pre-request Script for All Requests

Add this to your collection's "Pre-request Script" tab to ensure correct headers:

```javascript
// Set Content-Type for all requests
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});

// Log request details
console.log('Request URL: ' + pm.request.url);
console.log('Method: ' + pm.request.method);
```

---

## Authorization Setup

### For All Authenticated Requests

1. Open any request that requires authentication
2. Go to "Authorization" tab
3. Select Type: "Bearer Token"
4. Token: `{{patient_token}}` or `{{doctor_token}}`

**OR** use Header method:

1. Go to "Headers" tab
2. Add header:
   - Key: `Authorization`
   - Value: `Token {{patient_token}}`

---

## Common Test Scripts

### Save Token After Login/Register

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    let data = pm.response.json();
    
    if (data.user.user_type === 'patient') {
        pm.environment.set('patient_token', data.token);
        pm.environment.set('patient_id', data.user.id);
    } else if (data.user.user_type === 'doctor') {
        pm.environment.set('doctor_token', data.token);
        pm.environment.set('doctor_id', data.user.id);
    }
    
    pm.test('Token saved successfully', function() {
        pm.expect(pm.environment.get(
            data.user.user_type === 'patient' ? 'patient_token' : 'doctor_token'
        )).to.exist;
    });
}
```

### Save ID from Response

```javascript
if (pm.response.code === 201 || pm.response.code === 200) {
    let data = pm.response.json();
    
    // Save different IDs based on response structure
    if (data.appointment) {
        pm.environment.set('appointment_id', data.appointment.id);
    }
    if (data.doctor_profile) {
        pm.environment.set('doctor_profile_id', data.doctor_profile.id);
    }
    if (data.slots) {
        pm.environment.set('slot_id', data.slots[0].id);
    }
}
```

### Verify Success Response

```javascript
pm.test('Response status is success', function() {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test('Response has required fields', function() {
    let data = pm.response.json();
    pm.expect(data).to.have.property('message');
});

pm.test('No errors in response', function() {
    let data = pm.response.json();
    pm.expect(data.error).to.be.undefined;
});
```

### Verify Error Response

```javascript
pm.test('Error response received', function() {
    pm.expect(pm.response.code).to.be.oneOf([400, 401, 403, 404]);
});

pm.test('Error message present', function() {
    let data = pm.response.json();
    pm.expect(Object.keys(data).length).to.be.greaterThan(0);
});
```

---

## Request Template Examples

### Template 1: Authenticated GET Request

```
GET {{api_base}}/appointments/my-appointments/
Authorization: Token {{patient_token}}
Accept: application/json
```

### Template 2: Authenticated POST Request

```
POST {{api_base}}/appointments/book/
Authorization: Token {{patient_token}}
Content-Type: application/json

{
  "doctor_id": 1,
  "date": "2026-03-25",
  "slot_number": 1,
  "symptoms": "Test symptoms"
}
```

### Template 3: Request with Query Parameters

```
GET {{api_base}}/doctors/{{doctor_id}}/available-slots/?date=2026-03-25&is_booked=false
Authorization: Token {{patient_token}}
Accept: application/json
```

---

## Debugging Tips

### 1. View Raw Response
- In response section, click "Raw" tab to see unformatted response
- Useful for debugging JSON parsing issues

### 2. Check Response Headers
- Click "Headers" tab in response
- Verify Content-Type, Server, etc.

### 3. Console Output
- Bottom of Postman window: click ">" icon
- Shows request/response logs
- Run tests and view results

### 4. Check Environment Variables
- Eye icon (top-right) → "Manage Environments"
- Verify variables are set correctly
- See "Current Value" and "Initial Value"

### 5. Use Pre-request Script for Debugging

```javascript
console.log('=== REQUEST DEBUG ===');
console.log('Token:', pm.environment.get('patient_token'));
console.log('Patient ID:', pm.environment.get('patient_id'));
console.log('Base URL:', pm.environment.get('base_url'));
console.log('==================');
```

---

## Complete Request Examples

### Example 1: Register Patient

**URL:** `POST {{api_base}}/accounts/register/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "test_patient_{{$timestamp}}",
  "email": "test_patient_{{$timestamp}}@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "first_name": "Test",
  "last_name": "Patient",
  "user_type": "patient",
  "phone_number": "+1234567890"
}
```

**Tests Tab:**
```javascript
pm.test('Patient registered successfully', function() {
    pm.expect(pm.response.code).to.equal(201);
    let data = pm.response.json();
    pm.expect(data.token).to.exist;
    pm.environment.set('patient_token', data.token);
});
```

---

### Example 2: Book Appointment

**URL:** `POST {{api_base}}/appointments/book/`

**Headers:**
```
Authorization: Token {{patient_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "doctor_id": 1,
  "date": "2026-04-01",
  "slot_number": 2,
  "symptoms": "Regular checkup"
}
```

**Tests Tab:**
```javascript
if (pm.response.code === 201) {
    let data = pm.response.json();
    pm.environment.set('appointment_id', data.appointment.id);
    
    pm.test('Appointment status is pending', function() {
        pm.expect(data.appointment.status).to.equal('pending');
    });
}
```

---

### Example 3: Get Available Slots

**URL:** `GET {{api_base}}/doctors/{{doctor_id}}/available-slots/?date=2026-04-01`

**Headers:**
```
Authorization: Token {{patient_token}}
Accept: application/json
```

**Tests Tab:**
```javascript
pm.test('Slots retrieved successfully', function() {
    pm.expect(pm.response.code).to.equal(200);
    let data = pm.response.json();
    pm.expect(Array.isArray(data)).to.be.true;
    
    if (data.length > 0) {
        pm.environment.set('slot_id', data[0].id);
    }
});
```

---

## Running Test Collections

### Method 1: Collection Runner (Recommended)

1. Click "Collection Runner" (or triangle icon)
2. Select your collection
3. Select environment
4. Set iterations if needed
5. Click "Run" button
6. View results in real-time

### Method 2: Run Single Folder

1. Right-click on folder in collection
2. Select "Run Folder"
3. Similar workflow as Collection Runner

### Method 3: Run Single Request

1. Open request
2. Click "Send"
3. View response

---

## Export & Share

### Export Collection

1. Right-click collection
2. Select "Export"
3. Choose format (JSON)
4. Save file
5. Share with team

### Export Environment

1. Click environments
2. Right-click environment
3. Select "Export"
4. Save file
5. Team can import with "Import" button

---

## Advanced Features

### Scripting Variables

```javascript
// Get variable
let token = pm.environment.get('patient_token');

// Set variable
pm.environment.set('new_variable', 'value');

// Clear variable
pm.environment.unset('variable_name');

// Global variables
pm.globals.set('global_var', 'value');
let globalVar = pm.globals.get('global_var');
```

### Conditional Logic

```javascript
if (pm.response.code === 200) {
    let data = pm.response.json();
    if (data.risk_level === 'high') {
        pm.environment.set('needs_doctor', true);
    }
}
```

### Array Operations

```javascript
let data = pm.response.json();
let doctors = data;

doctors.forEach(function(doctor) {
    console.log(doctor.specialization);
});

// Save first doctor ID
pm.environment.set('first_doctor_id', doctors[0].id);
```

---

## Troubleshooting Common Postman Issues

### Issue: "Authentication credentials were not provided"

**Solution:**
1. Check Authorization header is set
2. Verify token is in environment
3. Ensure header format: `Token abc123` (not `Bearer abc123`)

### Issue: "Variable not set" error

**Solution:**
1. Run authentication request first
2. Check variable name in Tests script
3. Verify spelling matches exactly

### Issue: Request times out

**Solution:**
1. Ensure backend server is running
2. Check base_url is correct
3. Set request timeout in Postman settings

### Issue: 401/403 errors

**Solution:**
1. Verify user role matches endpoint
2. Check token hasn't expired
3. Patient cannot access doctor endpoints

### Issue: 400 Bad Request

**Solution:**
1. Validate JSON syntax
2. Check all required fields present
3. Verify data types (e.g., numbers not strings)

---

## Postman Settings Recommendations

### Recommended Settings

1. **Settings → General:**
   - ✅ Automatically follow redirects
   - ✅ Use system proxy settings
   - ⚠️ Disable SSL certificate verification (dev only)

2. **Settings → Reqoests:**
   - Set Default Request Timeout: 30000ms
   - Trim keys and values in POST data

3. **Settings → Tests:**
   - Enable "Show test results in layout"

---

## Team Collaboration

### Share via GitHub

1. Export collection and environment
2. Push to GitHub repository
3. Team members can import
4. Keep in sync with `.gitignore` of sensitive data

### Share via Postman Cloud

1. Click workspace name
2. "Share" button
3. Invite team members
4. Real-time synchronization

---

## Performance Testing (Advanced)

### Load Testing Script

```javascript
// Run multiple times to test performance
let startTime = new Date();

// Make request (Postman handles this)

let endTime = new Date();
let responseTime = endTime - startTime;

pm.test('Response within 500ms', function() {
    pm.expect(responseTime).to.be.below(500);
});

console.log('Response time: ' + responseTime + 'ms');
```

---

**End of Postman Setup Guide**

*For detailed API testing scenarios, see POSTMAN_COMPLETE_TESTING_GUIDE.md*
