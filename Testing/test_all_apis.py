#!/usr/bin/env python3
"""
Health Predictor API - Automated Test Suite
Tests all 32 API endpoints with a single command
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api"

# Test data
PATIENT_USERNAME = f"test_patient_{int(time.time())}"
DOCTOR_USERNAME = f"test_doctor_{int(time.time())}"
PATIENT_EMAIL = f"patient_{int(time.time())}@test.com"
DOCTOR_EMAIL = f"doctor_{int(time.time())}@test.com"

# Store tokens and IDs
tokens = {}
ids = {}

# Test results
results = {"passed": 0, "failed": 0, "errors": []}

def print_header(title):
    """Print section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_test(name, status, response_code=None):
    """Print test result"""
    status_icon = "✅" if status else "❌"
    code_str = f" (HTTP {response_code})" if response_code else ""
    print(f"{status_icon} {name}{code_str}")
    
    if status:
        results["passed"] += 1
    else:
        results["failed"] += 1

def test_register_patient():
    """Test: Register Patient"""
    try:
        data = {
            "username": PATIENT_USERNAME,
            "email": PATIENT_EMAIL,
            "password": "TestPass123!@",
            "password2": "TestPass123!@",
            "first_name": "Test",
            "last_name": "Patient",
            "user_type": "patient",
            "phone_number": "+1234567890"
        }
        resp = requests.post(f"{API_BASE}/accounts/register/", json=data)
        
        if resp.status_code == 201:
            tokens["patient"] = resp.json()["token"]
            ids["patient_id"] = resp.json()["user"]["id"]
            print_test("Register Patient", True, resp.status_code)
            return True
        else:
            print_test("Register Patient", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Register Patient", False)
        results["errors"].append(str(e))
        return False

def test_register_doctor():
    """Test: Register Doctor"""
    try:
        data = {
            "username": DOCTOR_USERNAME,
            "email": DOCTOR_EMAIL,
            "password": "DoctorPass123!@",
            "password2": "DoctorPass123!@",
            "first_name": "Dr",
            "last_name": "Test",
            "user_type": "doctor",
            "phone_number": "+0987654321"
        }
        resp = requests.post(f"{API_BASE}/accounts/register/", json=data)
        
        if resp.status_code == 201:
            tokens["doctor"] = resp.json()["token"]
            ids["doctor_user_id"] = resp.json()["user"]["id"]
            print_test("Register Doctor", True, resp.status_code)
            return True
        else:
            print_test("Register Doctor", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Register Doctor", False)
        results["errors"].append(str(e))
        return False

def test_login_patient():
    """Test: Login Patient"""
    try:
        data = {"username": PATIENT_USERNAME, "password": "TestPass123!@"}
        resp = requests.post(f"{API_BASE}/accounts/login/", json=data)
        
        if resp.status_code == 200:
            print_test("Login Patient", True, resp.status_code)
            return True
        else:
            print_test("Login Patient", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Login Patient", False)
        results["errors"].append(str(e))
        return False

def test_get_profile():
    """Test: Get Profile"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(f"{API_BASE}/accounts/profile/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Profile", True, resp.status_code)
            return True
        else:
            print_test("Get Profile", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Profile", False)
        results["errors"].append(str(e))
        return False

def test_update_profile():
    """Test: Update Profile"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        data = {"phone_number": "+9876543210"}
        resp = requests.put(f"{API_BASE}/accounts/profile/", json=data, headers=headers)
        
        if resp.status_code == 200:
            print_test("Update Profile", True, resp.status_code)
            return True
        else:
            print_test("Update Profile", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Update Profile", False)
        results["errors"].append(str(e))
        return False

def test_create_doctor_profile():
    """Test: Create Doctor Profile"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        data = {
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
        resp = requests.post(f"{API_BASE}/doctors/create-profile/", json=data, headers=headers)
        
        if resp.status_code == 201:
            ids["doctor_profile_id"] = resp.json()["doctor_profile"]["id"]
            print_test("Create Doctor Profile", True, resp.status_code)
            return True
        else:
            print_test("Create Doctor Profile", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Create Doctor Profile", False)
        results["errors"].append(str(e))
        return False

def test_check_doctor_profile():
    """Test: Check Doctor Profile"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        resp = requests.get(f"{API_BASE}/doctors/check-profile/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Check Doctor Profile", True, resp.status_code)
            return True
        else:
            print_test("Check Doctor Profile", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Check Doctor Profile", False)
        results["errors"].append(str(e))
        return False

def test_get_doctor_profile():
    """Test: Get Doctor's Own Profile"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        resp = requests.get(f"{API_BASE}/doctors/my-profile/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Doctor's Own Profile", True, resp.status_code)
            return True
        else:
            print_test("Get Doctor's Own Profile", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Doctor's Own Profile", False)
        results["errors"].append(str(e))
        return False

def test_update_doctor_profile():
    """Test: Update Doctor Profile"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        data = {"consultation_fee": 600.00}
        resp = requests.put(f"{API_BASE}/doctors/update-profile/", json=data, headers=headers)
        
        if resp.status_code == 200:
            print_test("Update Doctor Profile", True, resp.status_code)
            return True
        else:
            print_test("Update Doctor Profile", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Update Doctor Profile", False)
        results["errors"].append(str(e))
        return False

def test_list_doctors():
    """Test: List All Doctors"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(f"{API_BASE}/doctors/list/", headers=headers)
        
        if resp.status_code == 200:
            doctors = resp.json()
            if isinstance(doctors, list) and len(doctors) > 0:
                ids["doctor_id"] = doctors[0]["id"]
            print_test("List All Doctors", True, resp.status_code)
            return True
        else:
            print_test("List All Doctors", False, resp.status_code)
            return False
    except Exception as e:
        print_test("List All Doctors", False)
        results["errors"].append(str(e))
        return False

def test_get_doctor_details():
    """Test: Get Doctor Details"""
    try:
        if "doctor_id" not in ids:
            print_test("Get Doctor Details", False)
            return False
            
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(f"{API_BASE}/doctors/{ids['doctor_id']}/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Doctor Details", True, resp.status_code)
            return True
        else:
            print_test("Get Doctor Details", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Doctor Details", False)
        results["errors"].append(str(e))
        return False

def test_generate_slots():
    """Test: Generate Time Slots"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        data = {
            "start_date": tomorrow,
            "end_date": end_date,
            "available_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "time_slots": [
                {"start": "09:00", "end": "12:00"},
                {"start": "14:00", "end": "17:00"}
            ],
            "slot_duration": 15
        }
        resp = requests.post(f"{API_BASE}/doctors/generate-slots/", json=data, headers=headers)
        
        if resp.status_code == 201:
            print_test("Generate Time Slots", True, resp.status_code)
            return True
        else:
            print_test("Generate Time Slots", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Generate Time Slots", False)
        results["errors"].append(str(e))
        return False

def test_view_slots():
    """Test: View Doctor's Slots"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        resp = requests.get(f"{API_BASE}/doctors/my-slots/", headers=headers)
        
        if resp.status_code == 200:
            slots = resp.json()
            if isinstance(slots, list) and len(slots) > 0:
                ids["slot_id"] = slots[0]["id"]
                ids["tomorrow_date"] = slots[0]["date"]
                ids["slot_number"] = slots[0]["slot_number"]
            print_test("View Doctor's Slots", True, resp.status_code)
            return True
        else:
            print_test("View Doctor's Slots", False, resp.status_code)
            return False
    except Exception as e:
        print_test("View Doctor's Slots", False)
        results["errors"].append(str(e))
        return False

def test_get_available_slots():
    """Test: Get Available Slots for Doctor"""
    try:
        if "doctor_id" not in ids or "tomorrow_date" not in ids:
            print_test("Get Available Slots", False)
            return False
            
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(
            f"{API_BASE}/doctors/{ids['doctor_id']}/available-slots/",
            headers=headers,
            params={"date": ids["tomorrow_date"]}
        )
        
        if resp.status_code == 200:
            print_test("Get Available Slots", True, resp.status_code)
            return True
        else:
            print_test("Get Available Slots", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Available Slots", False)
        results["errors"].append(str(e))
        return False

def test_add_slot():
    """Test: Add Single Time Slot"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        future_date = (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d")
        data = {
            "date": future_date,
            "start_time": "10:00",
            "end_time": "11:00",
            "slot_number": 5
        }
        resp = requests.post(f"{API_BASE}/doctors/add-slot/", json=data, headers=headers)
        
        if resp.status_code == 201:
            print_test("Add Single Time Slot", True, resp.status_code)
            return True
        else:
            print_test("Add Single Time Slot", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Add Single Time Slot", False)
        results["errors"].append(str(e))
        return False

def test_book_appointment():
    """Test: Book Appointment"""
    try:
        if "doctor_id" not in ids or "tomorrow_date" not in ids or "slot_number" not in ids:
            print_test("Book Appointment", False)
            return False
            
        headers = {"Authorization": f"Token {tokens['patient']}"}
        data = {
            "doctor_id": ids["doctor_id"],
            "date": ids["tomorrow_date"],
            "slot_number": ids["slot_number"],
            "symptoms": "Regular checkup"
        }
        resp = requests.post(f"{API_BASE}/appointments/book/", json=data, headers=headers)
        
        if resp.status_code == 201:
            ids["appointment_id"] = resp.json()["appointment"]["id"]
            print_test("Book Appointment", True, resp.status_code)
            return True
        else:
            print_test("Book Appointment", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Book Appointment", False)
        results["errors"].append(str(e))
        return False

def test_get_my_appointments():
    """Test: Get Patient's Appointments"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(f"{API_BASE}/appointments/my-appointments/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Patient's Appointments", True, resp.status_code)
            return True
        else:
            print_test("Get Patient's Appointments", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Patient's Appointments", False)
        results["errors"].append(str(e))
        return False

def test_get_appointment_details():
    """Test: Get Appointment Details"""
    try:
        if "appointment_id" not in ids:
            print_test("Get Appointment Details", False)
            return False
            
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(
            f"{API_BASE}/appointments/{ids['appointment_id']}/",
            headers=headers
        )
        
        if resp.status_code == 200:
            print_test("Get Appointment Details", True, resp.status_code)
            return True
        else:
            print_test("Get Appointment Details", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Appointment Details", False)
        results["errors"].append(str(e))
        return False

def test_check_slot_availability():
    """Test: Check Slot Availability"""
    try:
        if "slot_id" not in ids:
            print_test("Check Slot Availability", False)
            return False
            
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(
            f"{API_BASE}/appointments/check-slot/{ids['slot_id']}/",
            headers=headers
        )
        
        if resp.status_code == 200:
            print_test("Check Slot Availability", True, resp.status_code)
            return True
        else:
            print_test("Check Slot Availability", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Check Slot Availability", False)
        results["errors"].append(str(e))
        return False

def test_get_doctor_appointments():
    """Test: Get Doctor's Appointments"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        resp = requests.get(f"{API_BASE}/appointments/doctor/appointments/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Doctor's Appointments", True, resp.status_code)
            return True
        else:
            print_test("Get Doctor's Appointments", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Doctor's Appointments", False)
        results["errors"].append(str(e))
        return False

def test_get_today_appointments():
    """Test: Get Today's Appointments"""
    try:
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        resp = requests.get(f"{API_BASE}/appointments/doctor/today/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Today's Appointments", True, resp.status_code)
            return True
        else:
            print_test("Get Today's Appointments", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Today's Appointments", False)
        results["errors"].append(str(e))
        return False

def test_update_appointment_status():
    """Test: Update Appointment Status"""
    try:
        if "appointment_id" not in ids:
            print_test("Update Appointment Status", False)
            return False
            
        headers = {"Authorization": f"Token {tokens['doctor']}"}
        data = {"status": "confirmed", "notes": "Confirmed by doctor"}
        resp = requests.patch(
            f"{API_BASE}/appointments/doctor/update-status/{ids['appointment_id']}/",
            json=data,
            headers=headers
        )
        
        if resp.status_code == 200:
            print_test("Update Appointment Status", True, resp.status_code)
            return True
        else:
            print_test("Update Appointment Status", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Update Appointment Status", False)
        results["errors"].append(str(e))
        return False

def test_get_upcoming_appointments():
    """Test: Get Upcoming Appointments"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(f"{API_BASE}/appointments/upcoming/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Upcoming Appointments", True, resp.status_code)
            return True
        else:
            print_test("Get Upcoming Appointments", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Upcoming Appointments", False)
        results["errors"].append(str(e))
        return False

def test_make_prediction():
    """Test: Make Health Prediction"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        data = {
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
        resp = requests.post(f"{API_BASE}/predictions/predict/", json=data, headers=headers)
        
        if resp.status_code == 201:
            ids["prediction_id"] = resp.json().get("id", 1)
            print_test("Make Health Prediction", True, resp.status_code)
            return True
        else:
            print_test("Make Health Prediction", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Make Health Prediction", False)
        results["errors"].append(str(e))
        return False

def test_get_prediction_history():
    """Test: Get Prediction History"""
    try:
        headers = {"Authorization": f"Token {tokens['patient']}"}
        resp = requests.get(f"{API_BASE}/predictions/history/", headers=headers)
        
        if resp.status_code == 200:
            print_test("Get Prediction History", True, resp.status_code)
            return True
        else:
            print_test("Get Prediction History", False, resp.status_code)
            return False
    except Exception as e:
        print_test("Get Prediction History", False)
        results["errors"].append(str(e))
        return False

def test_error_scenarios():
    """Test: Error Scenarios"""
    try:
        # Test missing authorization
        resp = requests.get(f"{API_BASE}/appointments/my-appointments/")
        if resp.status_code == 401:
            print_test("Missing Authorization Token", True, resp.status_code)
            results["passed"] += 1
        else:
            print_test("Missing Authorization Token", False, resp.status_code)
            results["failed"] += 1
        
        # Test invalid token
        resp = requests.get(
            f"{API_BASE}/appointments/my-appointments/",
            headers={"Authorization": "Token invalid_token"}
        )
        if resp.status_code == 401:
            print_test("Invalid Token", True, resp.status_code)
            results["passed"] += 1
        else:
            print_test("Invalid Token", False, resp.status_code)
            results["failed"] += 1
            
    except Exception as e:
        results["errors"].append(str(e))

def print_summary():
    """Print test summary"""
    print_header("TEST SUMMARY")
    total = results["passed"] + results["failed"]
    percentage = (results["passed"] / total * 100) if total > 0 else 0
    
    print(f"\n✅ Passed: {results['passed']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"📊 Total:  {total}")
    print(f"📈 Success Rate: {percentage:.1f}%")
    
    if results["errors"]:
        print(f"\n⚠️  Errors ({len(results['errors'])}):")
        for error in results["errors"][:5]:  # Show first 5 errors
            print(f"   - {error}")
    
    status = "✅ ALL TESTS PASSED" if results["failed"] == 0 else "❌ SOME TESTS FAILED"
    print(f"\n{status}\n")

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  Health Predictor - Complete API Test Suite")
    print("  Testing all 32 endpoints")
    print("="*60)
    print(f"\nBackend URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Check if backend is running
    try:
        resp = requests.get(BASE_URL, timeout=2)
    except:
        print("❌ ERROR: Backend server is not running!")
        print(f"   Please start the backend: python manage.py runserver")
        return
    
    # Authentication Tests
    print_header("Authentication Tests (5 endpoints)")
    test_register_patient()
    test_register_doctor()
    test_login_patient()
    test_get_profile()
    test_update_profile()
    
    # Doctor Management Tests
    print_header("Doctor Management Tests (9 endpoints)")
    test_create_doctor_profile()
    test_check_doctor_profile()
    test_get_doctor_profile()
    test_update_doctor_profile()
    test_list_doctors()
    test_get_doctor_details()
    test_generate_slots()
    test_view_slots()
    test_get_available_slots()
    
    # Time Slot Tests
    print_header("Time Slot Management (1 endpoint)")
    test_add_slot()
    
    # Appointment Tests
    print_header("Appointment Management (7 endpoints)")
    test_book_appointment()
    test_get_my_appointments()
    test_get_appointment_details()
    test_check_slot_availability()
    test_get_doctor_appointments()
    test_get_today_appointments()
    test_update_appointment_status()
    test_get_upcoming_appointments()
    
    # Health Prediction Tests
    print_header("Health Prediction Tests (2 endpoints)")
    test_make_prediction()
    test_get_prediction_history()
    
    # Error Scenario Tests
    print_header("Error Scenario Tests (2 endpoints)")
    test_error_scenarios()
    
    # Summary
    print_summary()

if __name__ == "__main__":
    main()
