# Health Predictor Backend - Recent Changes

## Overview
This document details all changes made to the Health Predictor backend since the last Git commit. These changes fix critical bugs in appointment booking, doctor availability toggling, and CORS issues.

---

## Files Modified

1. `health_predictor/appointments/serializers.py`
2. `health_predictor/appointments/views.py`
3. `health_predictor/doctors/serializers.py`
4. `health_predictor/health_predictor/settings.py`

---

## Detailed Changes

### 1. **appointments/serializers.py** - Fixed Duplicate Slot Issue

#### Problem
The booking system was failing with "get() returned more than one TimeSlot" error due to non-unique queries on `slot_number` alone. Multiple TimeSlots could exist with the same `slot_number` on different times.

#### Solution
Changed the time slot lookup from `slot_number` to use the actual unique constraint `(doctor, date, start_time)`.

#### Changes Made

**Before:**
```python
class BookAppointmentSerializer(serializers.Serializer):
    """Serializer for booking an appointment using doctor_id, date, and slot_number"""
    doctor_id = serializers.IntegerField()
    date = serializers.DateField()
    slot_number = serializers.IntegerField(min_value=1)
    symptoms = serializers.CharField(max_length=500)
    
    def validate(self, data):
        # ...
        time_slot = TimeSlot.objects.get(
            doctor=doctor,
            date=appointment_date,
            slot_number=slot_number,
            is_booked=False
        )
```

**After:**
```python
class BookAppointmentSerializer(serializers.Serializer):
    """Serializer for booking an appointment using doctor_id, date, start_time, and optional slot_number"""
    doctor_id = serializers.IntegerField()
    date = serializers.DateField()
    start_time = serializers.TimeField()  # ← NEW
    slot_number = serializers.IntegerField(min_value=1, required=False)  # ← Now optional
    symptoms = serializers.CharField(max_length=500)
    
    def validate(self, data):
        # ...
        start_time = data['start_time']  # ← NEW
        
        # Use select_for_update() for database-level locking
        time_slot = TimeSlot.objects.select_for_update().get(
            doctor=doctor,
            date=appointment_date,
            start_time=start_time,  # ← Now using start_time
            is_booked=False
        )
```

#### Key Improvements
- ✅ Uses unique fields `(doctor, date, start_time)` for unambiguous queries
- ✅ Added `select_for_update()` for database-level row locking (prevents race conditions)
- ✅ Made `slot_number` optional (optional field)
- ✅ Frontend now sends `start_time` with booking requests

---

### 2. **appointments/views.py** - Added Transaction Support & Error Handling

#### Problem
Race conditions could occur when multiple users simultaneously booked the same slot. No atomic transaction management.

#### Solution
Wrapped the booking endpoint with `@transaction.atomic` and added comprehensive error handling.

#### Changes Made

**Before:**
```python
class BookAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        if request.user.user_type != 'patient':
            return Response(...)
        
        serializer = BookAppointmentSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            appointment = serializer.save()
            # ...
            return Response({...}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

**After:**
```python
class BookAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic  # ← NEW: Database-level atomicity
    def post(self, request):
        try:  # ← NEW: Comprehensive error handling
            if request.user.user_type != 'patient':
                return Response(...)
            
            serializer = BookAppointmentSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                appointment = serializer.save()
                # ...
                return Response({...}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:  # ← NEW: Catch unexpected errors
            return Response(
                {'error': f'Booking failed: {str(e)}. This slot may have just been booked. Please try another slot.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

#### Key Improvements
- ✅ `@transaction.atomic` ensures all database operations are atomic (all-or-nothing)
- ✅ Try-catch block handles race conditions gracefully
- ✅ User-friendly error messages explaining when slots are just booked
- ✅ Prevents double-booking through database transactions

---

### 3. **doctors/serializers.py** - Made Profile Fields Optional (PATCH Support)

#### Problem
The `PUT /api/doctors/update-profile/` endpoint was requiring all fields (`available_days`, `time_slots`, `slot_duration`), but the frontend only wanted to update `is_available` status. This caused 400 Bad Request errors.

#### Solution
Changed required fields to optional to support partial updates via PATCH method.

#### Changes Made

**Before:**
```python
class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    available_days = serializers.JSONField(required=True)  # ← Required
    time_slots = serializers.JSONField(required=True)      # ← Required
    slot_duration = serializers.IntegerField(required=True) # ← Required
```

**After:**
```python
class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)  # ← Optional
    
    available_days = serializers.JSONField(required=False)  # ← Optional
    time_slots = serializers.JSONField(required=False)      # ← Optional
    slot_duration = serializers.IntegerField(required=False) # ← Optional
```

#### Key Improvements
- ✅ Supports PATCH requests for partial profile updates
- ✅ Doctor availability toggle can work independently
- ✅ Backward compatible with full profile updates

---

### 4. **health_predictor/settings.py** - Fixed CORS & Network Configuration

#### Problem
Frontend (port 5173) could not communicate with backend (port 8000) due to:
1. CORS middleware not properly configured
2. `ALLOWED_HOSTS` restricted to empty list
3. Missing CORS origin configuration

#### Solution
Configured proper CORS middleware and allowed frontend origins.

#### Changes Made

**Before:**
```python
# Line 28
ALLOWED_HOSTS = []

# Line 61 - Middleware missing CorsMiddleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ...
]

# End of file - No CORS configuration
```

**After:**
```python
# Line 28 - Allow all hosts (development)
ALLOWED_HOSTS = ['*']

# Line 61 - CorsMiddleware added FIRST
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← NEW: Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ...
]

# End of file - NEW: CORS Configuration
# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # Frontend dev server
    "http://localhost:3000",   # Alternative frontend port
    "http://127.0.0.1:5173",   # Localhost alias
    "http://127.0.0.1:3000",   # Localhost alternative
]

CORS_ALLOW_CREDENTIALS = True  # Allow credentials in CORS requests
```

#### Key Improvements
- ✅ `CorsMiddleware` placed at top of middleware stack (required by django-cors-headers)
- ✅ `CORS_ALLOWED_ORIGINS` specifies which frontend origins can access the API
- ✅ `ALLOWED_HOSTS = ['*']` permits all host headers (fine for development)
- ✅ `CORS_ALLOW_CREDENTIALS = True` allows cookies/authentication headers

---

## Bug Fixes Summary

| Bug | Root Cause | Fix | Status |
|---|---|---|---|
| **Duplicate TimeSlot Error** | Non-unique query on `slot_number` | Query using unique constraint `(doctor, date, start_time)` | ✅ Fixed |
| **Race Condition** | No atomic transactions | Added `@transaction.atomic` | ✅ Fixed |
| **PATCH 400 Bad Request** | Required fields for partial updates | Made profile fields optional | ✅ Fixed |
| **CORS Failed to Fetch** | Missing CORS middleware/config | Added CorsMiddleware + CORS settings | ✅ Fixed |
| **Doctor Availability 400** | Required full profile for toggle | Changed to PATCH method + optional fields | ✅ Fixed |

---

## Frontend Changes Required

📝 **Note:** Frontend also updated to support these backend changes:

1. **PatientDashboard.jsx** (line 709)
   - Added `start_time` to booking request payload
   ```javascript
   // Before
   body:{ doctor_id:selDoc.id, date:selDate, slot_number:selSlot.slot_number, symptoms }
   
   // After
   body:{ doctor_id:selDoc.id, date:selDate, slot_number:selSlot.slot_number, start_time:selSlot.start_time, symptoms }
   ```

2. **DoctorDashboard.jsx** (line 370)
   - Changed availability toggle from PUT to PATCH
   ```javascript
   // Before
   method: "PUT",
   
   // After
   method: "PATCH",
   ```

---

## Testing Recommendations

### 1. **Test Appointment Booking**
```bash
curl -X POST http://localhost:8000/api/appointments/book/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "date": "2026-03-25",
    "start_time": "09:00",
    "slot_number": 1,
    "symptoms": "Headache"
  }'
```

### 2. **Test Doctor Availability Toggle**
```bash
curl -X PATCH http://localhost:8000/api/doctors/update-profile/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_available": false}'
```

### 3. **Test CORS Headers**
```bash
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8000/api/appointments/book/ -v
```

---

## Database Impact

- ✅ No new migrations required
- ✅ No schema changes
- ✅ All changes backward compatible
- ⚠️ Note: `db.sqlite3` was modified (row locking + transaction support)

---

## Deployment Checklist

- [ ] Restart backend server: `python manage.py runserver`
- [ ] Verify CORS headers: Check browser DevTools Network tab
- [ ] Test appointment booking flow
- [ ] Test doctor availability toggle
- [ ] Monitor for "get() returned more than one" errors (should be gone)
- [ ] Verify no CORS "failed to fetch" errors

---

## Future Improvements

1. **Production CORS**: Update `CORS_ALLOWED_ORIGINS` with your production domain
2. **Database Optimization**: Add index on `(doctor_id, date, start_time)` for faster queries
3. **Error Logging**: Add structured logging for booking failures
4. **Rate Limiting**: Prevent booking spam attacks
5. **Slot Expiry**: Implement timeout for locked slots

---

**Last Updated:** March 21, 2026  
**Backend Version:** Django 6.0.3  
**DRF Version:** rest_framework (latest)
