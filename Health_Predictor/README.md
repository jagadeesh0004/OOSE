# Health Predictor Backend

A Django REST API for managing doctor appointments and health predictions, featuring real-time appointment booking, doctor availability management, and patient prediction history.

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Virtual Environment (`venv`)
- Django 6.0.3
- Django REST Framework

### Installation

```bash
# Clone repository
cd Health_Predictor
cd health_predictor

# Activate virtual environment
# Windows
..\..\..\.venv\Scripts\Activate.ps1

# macOS/Linux
source ../../../../.venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver 0.0.0.0:8000
```

Server will be available at: **http://localhost:8000**

---

## 📋 Recent Changes (v1.1)

### 🐛 Bug Fixes
1. **Duplicate TimeSlot Query Error** → Fixed with proper unique constraints
2. **Race Conditions in Booking** → Added database locks + atomic transactions  
3. **Profile Update 400 Errors** → Made fields optional for partial PATCH updates
4. **CORS Failed to Fetch** → Configured CORS middleware properly

### 📝 Files Modified
- `appointments/serializers.py` - Added `start_time` field, database locking
- `appointments/views.py` - Added `@transaction.atomic`, error handling
- `doctors/serializers.py` - Made fields optional
- `health_predictor/settings.py` - Fixed CORS configuration

👉 **See [CHANGES.md](CHANGES.md) for detailed changelog**

---

## 📋 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication
All protected endpoints require:
```
Header: Authorization: Token YOUR_TOKEN_HERE
```

---

## 🏥 Core Endpoints

### Accounts (Authentication)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/accounts/login/` | User login |
| POST | `/accounts/register/` | User registration |
| POST | `/accounts/logout/` | User logout |

### Doctors
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/doctors/create-profile/` | Create doctor profile |
| GET | `/doctors/my-profile/` | Get own profile + availability |
| PUT | `/doctors/update-profile/` | Full profile update |
| PATCH | `/doctors/update-profile/` | Partial update (e.g., availability) |
| GET | `/doctors/check-profile/` | Check if profile exists |
| GET | `/doctors/list/` | List all available doctors |
| POST | `/doctors/generate-slots/` | Generate appointment slots |
| DELETE | `/doctors/delete-slot/` | Delete specific slot |
| DELETE | `/doctors/delete-all-slots/` | Delete all slots |

### Appointments
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/appointments/book/` | Book appointment |
| GET | `/appointments/my-appointments/` | Get patient's appointments |
| GET | `/appointments/doctor/appointments/` | Get doctor's appointments |
| GET | `/appointments/upcoming/` | Get upcoming appointments |
| GET | `/appointments/doctor/today/` | Get today's appointments |
| GET | `/appointments/<id>/` | Get appointment details |
| PATCH | `/appointments/<id>/update-status/` | Update appointment status |
| DELETE | `/appointments/cancel/<id>/` | Cancel appointment |

### Predictions 
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/predictions/history/` | Get patient's prediction history |

---

## 🔑 Authentication Flow

### 1. Register
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123",
    "password2": "secure123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "555-1234",
    "user_type": "patient"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure123"
  }'
```

**Response:**
```json
{
  "token": "abc123xyz...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "user_type": "patient",
    "first_name": "John"
  }
}
```

### 3. Use Token
```bash
curl -X GET http://localhost:8000/api/doctors/list/ \
  -H "Authorization: Token abc123xyz..."
```

---

## 📱 Key Features

### ✅ Appointment Booking
- Real-time slot availability checking
- Race condition prevention (database locking)
- Atomic transactions (all-or-nothing booking)
- Duplicate prevention via unique constraints

### ✅ Doctor Availability Toggle
- One-click availability status change
- Optimistic UI updates with rollback
- Atomic PATCH requests

### ✅ CORS Support
- Frontend and backend communication enabled
- Configurable allowed origins for development

---

## 🗂️ Project Structure

```
health_predictor/
├── accounts/              # User authentication & profiles
│   ├── models.py         # User, DoctorProfile models
│   ├── serializers.py    # User serialization
│   ├── views.py          # Login, register, logout
│   └── urls.py           # Auth routes
│
├── appointments/          # Appointment management
│   ├── models.py         # Appointment model
│   ├── serializers.py    # Appointment, booking serializers
│   ├── views.py          # Booking, listing views
│   └── urls.py           # Appointment routes
│
├── doctors/              # Doctor management
│   ├── models.py         # DoctorProfile, TimeSlot models
│   ├── serializers.py    # Doctor profile, slot serializers
│   ├── views.py          # Profile, slot management views
│   └── urls.py           # Doctor routes
│
├── predictions/          # Health predictions
│   ├── models.py         # Prediction model
│   ├── views.py          # Prediction views
│   └── urls.py           # Prediction routes
│
├── health_predictor/     # Django settings
│   ├── settings.py       # Project configuration
│   ├── urls.py           # Main URL routing
│   └── wsgi.py          # WSGI application
│
├── manage.py            # Django management
├── db.sqlite3           # SQLite database
└── requirements.txt     # Python dependencies
```

---

## 🔐 Database Models

### User (accounts)
```python
- id (Integer, PK)
- username (String, unique)
- email (String, unique)
- user_type (Choice: 'patient' or 'doctor')
- first_name, last_name, phone_number
```

### DoctorProfile (accounts)
```python
- id (Integer, PK)
- user (ForeignKey → User)
- specialization (String)
- qualification (String)
- experience_years (Integer)
- hospital_name (String)
- is_available (Boolean, default=True)  # ← Toggle status
- available_days (JSON)
- time_slots (JSON)
```

### TimeSlot (doctors)
```python
- id (Integer, PK)
- doctor (ForeignKey → DoctorProfile)
- date (Date)
- start_time (Time)
- end_time (Time)
- slot_number (Integer)
- is_booked (Boolean)
- unique_together: (doctor, date, start_time)
```

### Appointment (appointments)
```python
- id (Integer, PK)
- patient (ForeignKey → User)
- time_slot (OneToOneField → TimeSlot)
- status (Choice: 'pending', 'confirmed', 'completed', 'cancelled')
- symptoms (Text)
- created_at, updated_at (DateTime)
```

---

## ⚙️ Configuration

### CORS Settings (`settings.py`)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Frontend dev server
    "http://localhost:3000",   # Alternative port
]
CORS_ALLOW_CREDENTIALS = True
```

### Authentication (`settings.py`)
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
```

---

## 🧪 Testing

### Test Appointment Booking
```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "date": "2026-03-25",
    "start_time": "09:00",
    "slot_number": 1,
    "symptoms": "Consultation needed"
  }'
```

### Test Doctor Availability
```bash
curl -X PATCH http://localhost:8000/api/doctors/update-profile/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_available": false}'
```

### Check CORS
```bash
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8000/api/appointments/book/ -v
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **ERR_CONNECTION_REFUSED** | Backend not running. Run `python manage.py runserver 0.0.0.0:8000` |
| **CORS failed to fetch** | Check CORS settings in `settings.py`, verify CorsMiddleware is first |
| **Invalid token** | Token expired. Login again to get new token |
| **Slot not available** | Slot already booked or doesn't exist for this date/time |
| **400 Bad Request** | Use PATCH for partial updates, PUT for full profile updates |

---

## 📦 Dependencies

```
Django==6.0.3
djangorestframework==3.14.0
django-cors-headers==4.0.0
python-dateutil==2.8.2
```

---

## 🔄 Development Workflow

```bash
# 1. Activate virtual environment
source .venv/bin/activate

# 2. Navigate to project
cd Health_Predictor/health_predictor

# 3. Run migrations
python manage.py migrate

# 4. Start server
python manage.py runserver 0.0.0.0:8000

# 5. Test with frontend at http://localhost:5173
```

---

**Last Updated:** March 21, 2026  
**Version:** 1.1  
**Django:** 6.0.3

│
├── accounts/        # User authentication & profile
├── doctors/         # Doctor profiles & time slots
├── appointments/    # Booking system
├── predictions/     # ML prediction APIs
├── manage.py
└── Pipfile / requirements
```

---

## 🔑 API Endpoints

### 🔐 Authentication (`/api/accounts/`)

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| POST   | `/register/` | Register new user |
| POST   | `/login/`    | Login user        |
| GET    | `/profile/`  | Get user profile  |
| POST   | `/logout/`   | Logout user       |

---

### 🧑‍⚕️ Doctors (`/api/doctors/`)

#### Profile Management

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/create-profile/` | Create doctor profile   |
| GET    | `/check-profile/`  | Check if profile exists |
| GET    | `/my-profile/`     | Get own profile         |
| PUT    | `/update-profile/` | Update profile          |

#### Slot Management

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/generate-slots/`   | Generate time slots  |
| GET    | `/my-slots/`         | View doctor slots    |
| POST   | `/add-slot/`         | Add single slot      |
| DELETE | `/delete-slot/<id>/` | Delete specific slot |
| DELETE | `/delete-slot/`      | Delete by date       |
| DELETE | `/delete-all-slots/` | Delete all slots     |

#### Public Endpoints

| Method | Endpoint                        | Description      |
| ------ | ------------------------------- | ---------------- |
| GET    | `/list/`                        | List all doctors |
| GET    | `/<id>/`                        | Doctor details   |
| GET    | `/<doctor_id>/available-slots/` | Available slots  |

---

### 📅 Appointments (`/api/appointments/`)

#### Patient

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/book/`            | Book appointment     |
| GET    | `/my-appointments/` | View my appointments |
| DELETE | `/cancel/<id>/`     | Cancel appointment   |

#### Doctor

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/doctor/appointments/`       | All doctor appointments |
| GET    | `/doctor/today/`              | Today’s appointments    |
| PATCH  | `/doctor/update-status/<id>/` | Update status           |

#### Common

| Method | Endpoint                               | Description           |
| ------ | -------------------------------------- | --------------------- |
| GET    | `/upcoming/`                           | Upcoming appointments |
| GET    | `/<id>/`                               | Appointment details   |
| GET    | `/check-slot/<slot_id>/`               | Slot availability     |
| GET    | `/doctor/<doctor_id>/available-slots/` | Slots for doctor      |

---

### 🧠 Predictions (`/api/predictions/`)

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| POST   | `/predict/` | Predict health condition |
| GET    | `/history/` | Prediction history       |
| GET    | `/<id>/`    | Prediction detail        |

---

## ⚙️ Setup Instructions

Follow these steps to run the project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/avinash-bobbadi/Health_Predictor.git
cd Health_Predictor
```

---

### 2️⃣ Install Pipenv (if not installed)

```bash
pip install pipenv
```

---

### 3️⃣ Create Virtual Environment & Install Dependencies

If `Pipfile` and `Pipfile.lock` are present:

```bash
pipenv install
```

This will:

* Create a virtual environment
* Install all required dependencies automatically

---

### 4️⃣ Activate Virtual Environment

```bash
pipenv shell
```

---

### 5️⃣ Verify Installation (Optional)

```bash
pip list
```

You should see packages like:

* Django
* djangorestframework
* sklearn

---

### 6️⃣ Apply Database Migrations

```bash
python manage.py migrate
```

---

### 7️⃣ Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

---

### 8️⃣ Run Development Server

```bash
python manage.py runserver
```

Server will start at:

```
http://127.0.0.1:8000/
```

---

### 9️⃣ Deactivate Virtual Environment

```bash
exit
```

---

## ⚠️ If Pipfile is NOT Working

You can install manually:

```bash
pip install django djangorestframework scikit-learn mysqlclient
```

---

## 💡 Notes

* Always activate environment using `pipenv shell` before running project
* Do not commit `.venv` or environment folders to GitHub
* Use `pipenv install <package>` to add new dependencies

---
--

## 🔐 Authentication

This project uses **Token Authentication**.
Include token in headers:

```
Authorization: Token <your_token>
```

---

## 📌 Future Improvements

* AI chatbot for health queries
* Video consultation system
* Payment integration
* Recommendation system for doctors

---

## 👨‍💻 Author

**Avinash Bobbadi**

---

## ⭐ Contribution

Feel free to fork this project and contribute!

---
