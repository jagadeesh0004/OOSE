# 🏥 Health Predictor - Complete Project Setup Guide

A comprehensive health prediction system with appointment booking and AI-powered risk assessment.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [API Endpoints](#api-endpoints)
7. [Detailed Setup Instructions](#detailed-setup-instructions)
8. [Running the Application](#running-the-application)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Health Predictor** is a full-stack application that helps patients:
- Register and create profiles
- Book appointments with doctors
- Get AI-powered health risk predictions
- Track their appointment and prediction history

**Doctors can:**
- Create and manage profiles
- Generate and manage appointment time slots
- View and manage patient appointments
- Update appointment status

The system uses **Django REST Framework** for the backend, **React + Vite** for the frontend, and **Machine Learning (RandomForest)** for health predictions.

---

## 📦 Prerequisites

Make sure you have installed:

| Component | Version | Link |
|-----------|---------|------|
| Python | 3.13+ | [python.org](https://www.python.org) |
| Node.js | 16+ | [nodejs.org](https://nodejs.org) |
| npm | 8+ | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### ✅ Check Installation
```bash
# Check Python
python --version

# Check Node.js
node --version

# Check npm
npm --version
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Backend Setup
```bash
# Navigate to backend
cd Health_Predictor

# Activate virtual environment (if exists, or create it)
# Windows
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
cd health_predictor
python manage.py migrate

# Start backend server
python manage.py runserver 0.0.0.0:8000
```

**Backend URL:** http://localhost:8000

### Step 2: Frontend Setup (New Terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend URL:** http://localhost:5173

### Step 3: You're Ready!
- Open http://localhost:5173 in your browser
- Register as a patient or doctor
- Start exploring the application

---

## 📁 Project Structure

```
OOSE/
├── Health_Predictor/          # Django backend (Port: 8000)
│   ├── health_predictor/
│   │   ├── accounts/          # User authentication
│   │   ├── appointments/      # Appointment management
│   │   ├── doctors/           # Doctor profiles & slots
│   │   ├── predictions/       # Health risk predictions
│   │   ├── profiles/          # Patient profiles
│   │   └── manage.py
│   ├── requirements.txt
│   └── Pipfile
│
├── frontend/                  # React + Vite (Port: 5173)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── api/               # API service calls
│   │   ├── services/          # Utility services
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── HealthRiskML/              # Machine Learning model
│   ├── src/
│   │   ├── train.py           # Model training
│   │   ├── predict_sample.py  # Prediction examples
│   │   └── config.py
│   ├── model/                 # Trained model files
│   ├── dataset/
│   └── requirements.txt
│
├── Documentation/             # Project documentation
│   ├── API_Doc/               # Complete API docs
│   └── Frontend_doc/
│
└── Testing/                   # Testing files & guides
    ├── CURL_COMMANDS_API_TESTING.md
    ├── POSTMAN_COMPLETE_TESTING_GUIDE.md
    └── test_all_apis.py
```

---

## ✨ Core Features

### 🔐 Authentication & User Management
- User registration (Patient/Doctor)
- Email-based login
- Token-based authentication (Knox)
- Profile creation and updates
- Role-based access control

### 👨‍⚕️ Doctor Management
- Doctor profile creation
- Specialization management
- **Time Slot Management:**
  - Auto-generate slots for specific dates
  - Manual slot creation
  - Slot deletion (single, by date, or all)
  - View available slots

### 📅 Appointment Booking System
- **Patient Features:**
  - Browse available doctors
  - View available time slots
  - Book appointments (prevents double-booking)
  - View appointment history
  - Cancel appointments

- **Doctor Features:**
  - View all appointments
  - View today's appointments
  - Update appointment status (pending → confirmed → completed)
  - Add notes to appointments

### 🧠 Health Risk Prediction (ML)
- AI-powered prediction using RandomForestClassifier
- Predicts health risk based on 10 health features
- Tracks prediction history
- User-friendly risk badge display

### 📊 Features Used for Prediction
**Numerical:**
- Age, Height (cm), Weight (kg)
- Temperature (°C), Blood Pressure, Heart Rate
- Sleep (hours/day)

**Categorical:**
- Gender, Smoking Status, Alcohol Consumption

---

## 🔌 API Endpoints

### 📌 Base URL
```
http://localhost:8000/api/
```

### 🔑 Accounts API
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/accounts/register/` | POST | Register new user |
| `/accounts/login/` | POST | Login & get token |
| `/accounts/profile/` | GET/PUT | View/Update profile |
| `/accounts/logout/` | POST | Logout |

### 👨‍⚕️ Doctors API
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/doctors/create-profile/` | POST | Create doctor profile |
| `/doctors/my-profile/` | GET | Get own profile |
| `/doctors/list/` | GET | List all doctors |
| `/doctors/generate-slots/` | POST | Generate slots |
| `/doctors/my-slots/` | GET | View own slots |
| `/doctors/add-slot/` | POST | Add single slot |
| `/doctors/delete-slot/<id>/` | DELETE | Delete slot |

### 📅 Appointments API
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/appointments/book/` | POST | Book appointment |
| `/appointments/my-appointments/` | GET | View your appointments |
| `/appointments/doctor/appointments/` | GET | Doctor: View all appointments |
| `/appointments/cancel/<id>/` | DELETE | Cancel appointment |

### 🧠 Predictions API
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/predictions/predict/` | POST | Get health prediction |
| `/predictions/history/` | GET | View prediction history |

---

## 📖 Detailed Setup Instructions

### Backend Setup (Django)

#### 1. Navigate to Backend
```bash
cd Health_Predictor
```

#### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Dependencies
```bash
# Option A: Using Pipenv (if you prefer)
pipenv install

# Option B: Using pip (recommended)
pip install -r requirements.txt
```

**Key Dependencies:**
- Django 6.0.3
- Django REST Framework
- Django CORS Headers
- Django Knox (Authentication)
- Scikit-learn (ML Predictions)
- Pandas & NumPy

#### 4. Navigate to Project Directory
```bash
cd health_predictor
```

#### 5. Create Database Tables
```bash
python manage.py migrate
```

#### 6. Create Superuser (Optional - for admin panel)
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
# Then access at http://localhost:8000/admin
```

#### 7. Start Backend Server
```bash
python manage.py runserver 0.0.0.0:8000
```

**Success Message:**
```
Starting development server at http://0.0.0.0:8000/
```

### Frontend Setup (React + Vite)

#### 1. Navigate to Frontend
```bash
cd frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start Development Server
```bash
npm run dev
```

**Output:**
```
  VITE v8.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### 4. Open in Browser
Navigate to http://localhost:5173

### Frontend Build (Production)

```bash
# Build optimized files
npm run build

# Preview production build
npm run preview
```

---

## 🏃 Running the Application

### Terminal 1: Start Backend
```bash
cd Health_Predictor/health_predictor
python manage.py runserver 0.0.0.0:8000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 (Optional): Check API
```bash
# Test if backend is running
curl http://localhost:8000/api/

# View available endpoints
curl http://localhost:8000/api/docs/ (if Swagger is enabled)
```

---

## 🧪 Testing

### Unit Tests

#### Backend Tests
```bash
cd Health_Predictor/health_predictor
python manage.py test
```

#### Run Specific App Tests
```bash
python manage.py test accounts
python manage.py test appointments
python manage.py test doctors
python manage.py test predictions
```

### API Testing with Postman

1. Import collection:
   ```
   Testing/Health_Predictor_API_Collection.json
   ```

2. Follow setup guide:
   ```
   Testing/POSTMAN_SETUP_AND_CONFIGURATION.md
   ```

### API Testing with CURL

```bash
# Register
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123","email":"test@example.com","user_type":"patient"}'

# Login
curl -X POST http://localhost:8000/api/accounts/login/ \
  -d '{"username":"testuser","password":"pass123"}'

# Get Profile (add Authorization header from login response)
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Python Test Script
```bash
cd Testing
python test_all_apis.py
```

---

## 🛠️ Troubleshooting

### Backend Issues

#### ❌ Module Not Found Error
```
ModuleNotFoundError: No module named 'django'
```
**Solution:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

#### ❌ Database Error: No Such Table
```
ProgrammingError: no such table: accounts_user
```
**Solution:**
```bash
python manage.py migrate
```

#### ❌ Port Already in Use
```
Address already in use (':8000')
```
**Solution:**
```bash
# Use different port
python manage.py runserver 0.0.0.0:8001

# Or kill process using port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

#### ❌ CORS Error: No 'Access-Control-Allow-Origin' Header
**Solution:** Check `CORS_ALLOWED_ORIGINS` in Django settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### Frontend Issues

#### ❌ npm ERR! 404 Not Found
**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Port 5173 Already in Use
**Solution:**
```bash
npm run dev -- --port 3000
```

#### ❌ Blank Page or CORS Error
1. Check backend is running at http://localhost:8000
2. Verify API URL in frontend code: `src/api/api.js`
3. Clear browser cache and reload

### Database Issues

#### ❌ UNIQUE constraint failed
**Solution:**
```bash
# Backup database if needed, then delete
rm db.sqlite3

# Re-run migrations
python manage.py migrate
```

---

## 📚 Additional Resources

### Documentation Files
- **API Documentation:** [Documentation/API_Doc/](Documentation/API_Doc/)
- **Testing Guide:** [Documentation/API_Doc/05_TESTING_GUIDE.md](Documentation/API_Doc/05_TESTING_GUIDE.md)
- **Frontend Analysis:** [Documentation/Frontend_doc/](Documentation/Frontend_doc/)
- **Testing Documentation:** [Testing/TESTING_DOCUMENTATION_INDEX.md](Testing/TESTING_DOCUMENTATION_INDEX.md)

### Key Concepts

**Authentication Flow:**
1. User registers with username, password, email, user_type
2. User logs in → receives token
3. Token sent in header for authenticated requests: `Authorization: Token <token>`

**Appointment Flow:**
1. Patient browses doctors → views available slots
2. Patient books appointment → appointment created (pending)
3. Doctor updates status → confirmed/completed
4. Patient can view history and cancel

**Prediction Flow:**
1. User submits health data (10 features)
2. ML model processes data
3. Returns risk level: Low/Medium/High
4. Prediction saved to history

---

## 🎓 Example: Complete User Flow

### 1. Register as Patient
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_patient",
    "password": "SecurePass123",
    "email": "john@example.com",
    "user_type": "patient"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_patient",
    "password": "SecurePass123"
  }'
```
Save the returned `token` for next steps.

### 3. Get Profile
```bash
curl -X GET http://localhost:8000/api/accounts/profile/ \
  -H "Authorization: Token <your_token>"
```

### 4. Get Health Prediction
```bash
curl -X POST http://localhost:8000/api/predictions/predict/ \
  -H "Authorization: Token <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "gender": "male",
    "weight": 75,
    "height": 180,
    "temperature": 37.5,
    "blood_pressure": 120,
    "heart_rate": 72,
    "sleep": 7,
    "smoking": "no",
    "alcohol": "no"
  }'
```

### 5. View Prediction History
```bash
curl -X GET http://localhost:8000/api/predictions/history/ \
  -H "Authorization: Token <your_token>"
```

---

## 💡 Tips & Best Practices

1. **Always activate virtual environment** before working with backend
2. **Keep both servers running** (backend & frontend) during development
3. **Use meaningful credentials** while testing
4. **Check console errors** in browser DevTools (F12) for frontend issues
5. **View Django logs** in terminal for backend issues
6. **Test APIs with Postman** before using in frontend
7. **Regular database backups** if using production data
8. **Use environment variables** for sensitive data (future enhancement)

---

## ✅ Checklist: Ready to Go?

- [ ] Python 3.13+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment created and activated
- [ ] Backend dependencies installed
- [ ] Database migrations completed
- [ ] Frontend dependencies installed
- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:5173
- [ ] Can register and login in the UI
- [ ] Can access API endpoints via Postman/CURL

**All checked? You're ready to go! 🎉**

---

## 📞 Support & Contribution

For issues or contributions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing documentation in `Documentation/`
3. Check recent changes in `Documentation/CHANGES.md`
4. Review testing guides in `Testing/`

---

**Last Updated:** March 28, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
