# 🔐 Accounts API Documentation

## Overview
The Accounts API handles user authentication, registration, login, logout, and profile management. It uses Token-based Authentication.

---

## 🔌 Base URL
```
/api/accounts/
```

---

## 📋 API Endpoints

### 1. **Register User** 
**Create a new user account (Patient or Doctor)**

- **Endpoint:** `POST /register/`
- **Permission:** `AllowAny` (No authentication required)
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "password2": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "patient",  // Options: "patient", "doctor", "admin"
  "phone_number": "+1234567890"
}
```

#### Response (201 Created)
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "patient",
    "phone_number": "+1234567890",
    "profile_pic": null
  },
  "token": "abc123token456",
  "message": "User created successfully"
}
```

#### Error Responses
- **400 Bad Request:** Password mismatch or validation errors
  ```json
  {
    "password": ["Password fields didn't match."]
  }
  ```
- **400 Bad Request:** Username already exists
  ```json
  {
    "username": ["This field must be unique."]
  }
  ```

#### Validations
- ✅ Passwords must match
- ✅ Password must be strong (min 8 chars, contains uppercase, lowercase, numbers, special chars)
- ✅ Email must be unique
- ✅ Username must be unique
- ✅ user_type must be one of: patient, doctor, admin
- ✅ First name and last name are required

---

### 2. **Login User**
**Authenticate user and get authentication token**

- **Endpoint:** `POST /login/`
- **Permission:** `AllowAny` (No authentication required)
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

#### Response (200 OK)
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "user_type": "patient",
    "phone_number": "+1234567890",
    "profile_pic": null
  },
  "token": "abc123token456",
  "message": "Login successful"
}
```

#### Error Responses
- **400 Bad Request:** Invalid credentials
  ```json
  {
    "non_field_errors": ["Invalid username or password"]
  }
  ```
- **400 Bad Request:** Missing fields
  ```json
  {
    "non_field_errors": ["Must include \"username\" and \"password\""]
  }
  ```

#### Notes
- Token is used for subsequent authenticated requests
- Token persists per user (one token per user)
- If user logs in again, same token is returned

---

### 3. **Get/Update User Profile**
**Retrieve or update current user profile**

- **Endpoint:** `GET/PUT /profile/`
- **Permission:** `IsAuthenticated` (Token required)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### GET Request
**Retrieve current user profile**

```
GET /profile/
Authorization: Token abc123token456
```

#### GET Response (200 OK)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "user_type": "patient",
  "phone_number": "+1234567890",
  "profile_pic": null
}
```

#### PUT Request
**Update user profile**

```
PUT /profile/
Authorization: Token abc123token456
Content-Type: application/json
```

```json
{
  "email": "john.new@example.com",
  "phone_number": "+9876543210",
  "profile_pic": "<image_file>"  // Optional: multipart form data
}
```

#### PUT Response (200 OK)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john.new@example.com",
  "user_type": "patient",
  "phone_number": "+9876543210",
  "profile_pic": "profiles/john_doe_pic.jpg"
}
```

#### Error Responses
- **401 Unauthorized:** Missing or invalid token
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }
  ```
- **404 Not Found:** User not found

#### Updateable Fields
- ✅ `email`
- ✅ `phone_number`
- ✅ `profile_pic`
- ✅ `address`
- ❌ `username` (read-only)
- ❌ `user_type` (read-only)

---

### 4. **Logout User**
**Logout and invalidate authentication token**

- **Endpoint:** `POST /logout/` (or `GET /logout/`)
- **Permission:** `IsAuthenticated` (Token required)
- **Content-Type:** `application/json`
- **Authentication Header:** `Authorization: Token <token>`

#### Request
```
POST /logout/
Authorization: Token abc123token456
```

#### Response (200 OK)
```json
{
  "message": "Logout successful"
}
```

#### Error Responses
- **400 Bad Request:** Logout failed
  ```json
  {
    "error": "Logout failed"
  }
  ```
- **401 Unauthorized:** Missing or invalid token
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }
  ```

#### Notes
- After logout, the token becomes invalid
- User must login again to get a new token
- Both GET and POST methods are supported

---

## 🔄 User Types & Roles

| User Type | Description | Capabilities |
|-----------|-------------|--------------|
| **patient** | Patient/User | Book appointments, View doctors, Get health predictions |
| **doctor** | Doctor/Healthcare Professional | Create profile, Manage slots, View appointments |
| **admin** | Administrator | System management (if implemented) |

---

## 📊 User Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | User unique identifier |
| `username` | String | Yes | Unique username |
| `email` | String | Yes | User email (unique) |
| `password` | String | Yes | User password (hashed) |
| `first_name` | String | Yes | User's first name |
| `last_name` | String | Yes | User's last name |
| `user_type` | Choice | Yes | patient/doctor/admin |
| `phone_number` | String | Yes | Contact number |
| `profile_pic` | ImageField | No | Profile picture URL |
| `address` | TextField | No | User's address |
| `created_at` | DateTime | Auto | Account creation timestamp |

---

## 🛡️ Authentication

### Token Authentication
All authenticated endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Token <your_token>
```

### Getting a Token
1. Register a new user → Receive token in response
2. Login an existing user → Receive token in response
3. Use this token for all subsequent authenticated requests

### Token Validity
- Tokens are permanent until user logs out
- Each user has ONE token
- Logging in again returns the same token (if already exists)
- After logout, token is deleted and becomes invalid

---

## 📝 Example Usage (cURL)

### Register
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "patient",
    "phone_number": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token abc123token456"
```

### Logout
```bash
curl -X POST http://localhost:8000/api/accounts/logout/ \
  -H "Authorization: Token abc123token456"
```

---

## ⚠️ Common Errors

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Password mismatch | Passwords don't match |
| 400 | Invalid credentials | Wrong username/password |
| 401 | Credentials not provided | Missing Authorization header |
| 404 | Not found | Token doesn't exist |
| 409 | Username already exists | Username taken |

---

## 🔄 Workflow

```
1. User Registration
   ↓
2. Receive Token & User Details
   ↓
3. Use Token for Authenticated Requests
   ↓
4. Logout (Token becomes invalid)
```

---
