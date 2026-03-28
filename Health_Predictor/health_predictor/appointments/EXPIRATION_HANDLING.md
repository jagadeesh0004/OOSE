# Appointment Expiration Handling

## Problem Solved
Previously, if a doctor failed to mark an appointment as "completed" after the scheduled time passed, the appointment would remain in "pending" or "confirmed" status indefinitely, and the TimeSlot would remain locked (is_booked=True).

## Solution

### 1. Model Properties (New Methods)
Added to `Appointment` model:

```python
@property
def is_expired(self):
    """Check if appointment time has passed"""
    # Returns True if current time > appointment end_time

@property
def can_be_marked_completed(self):
    """Doctor can only mark as completed if time has passed"""
    # Returns True if expired and not already completed/cancelled
```

### 2. Automatic Completion Methods

#### Option A: Management Command (Scheduled Task)
Run periodically (e.g., via cron or Celery beat):

```bash
python manage.py auto_complete_appointments
```

**How it works:**
- Finds all appointments where status is 'pending' or 'confirmed'
- Checks if the appointment time has already passed
- Auto-marks them as 'completed'
- Does NOT unlock the TimeSlot (appointment is considered "done")

**Setup with Celery Beat** (if using Celery):
```python
# In celery beat schedule
'auto-complete-appointments': {
    'task': 'appointments.tasks.auto_complete_expired_appointments',
    'schedule': crontab(minute=0, hour='*'),  # Run every hour
}
```

#### Option B: Signal Handler (Real-time)
Automatically triggers when an appointment is saved:

```python
# appointments/signals.py
@receiver(pre_save, sender=Appointment)
def handle_appointment_expiration(sender, instance, **kwargs):
    # Prevents status reversions on expired appointments
    # Logs when appointments are marked complete
```

### 3. What Happens to the TimeSlot?

**Current Behavior:**
- When appointment is marked as 'completed', `TimeSlot.is_booked` stays `True`
- This is intentional: the slot exists and was used; you might want to keep the history
- The slot remains "locked" (cannot be re-booked)

**Alternative: Free the slot on cancellation**
Already implemented - when appointment is cancelled:
```python
# In CancelAppointmentView
time_slot.is_booked = False  # Slot becomes available again
time_slot.save()
```

## Workflow Summary

| Scenario | Current Status | Auto-Complete? | TimeSlot State |
|----------|---|---|---|
| Appointment time passes, doctor marks as completed | Completed | ✓ | is_booked=True (locked) |
| Appointment time passes, doctor marks as cancelled | Cancelled | ✗ | is_booked=False (freed) |
| Appointment time passes, doctor does nothing (NEW) | Completed (auto) | ✓* | is_booked=True (locked) |

*After running management command or via signal handling

## Usage Instructions

### Real-time Auto-Completion
Already enabled via signal handlers. Appointments automatically prevent status changes once expired.

### Scheduled Auto-Completion
1. Run the management command:
   ```bash
   python manage.py auto_complete_appointments
   ```

2. Schedule it with cron:
   ```bash
   0 * * * * cd /path/to/project && python manage.py auto_complete_appointments
   ```

3. Or use Celery Beat (recommended for production):
   ```python
   # settings.py or celery config
   CELERY_BEAT_SCHEDULE = {
       'auto-complete-appointments': {
           'task': 'appointments.tasks.auto_complete_expired_appointments',
           'schedule': crontab(minute=0),  # Every hour
       },
   }
   ```

## Testing

```python
# In Django shell
from appointments.models import Appointment
from datetime import datetime, timedelta
from django.utils import timezone

# Get an expired appointment
appt = Appointment.objects.filter(status='pending').first()
print(f"Is expired: {appt.is_expired}")
print(f"Can mark completed: {appt.can_be_marked_completed}")

# Manual completion
appt.status = 'completed'
appt.save()  # Signal handler will log this
```

## Frontend UI Enhancement Suggestion

Show on doctor's appointments list:
- Expired appointments in "red" or dimmed
- "Auto-marked" badge for appointments auto-completed
- Prevent editing status of already-completed appointments
