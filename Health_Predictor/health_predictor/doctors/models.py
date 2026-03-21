from django.db import models
from accounts.models import DoctorProfile

class TimeSlot(models.Model):
    # Change related_name from 'time_slots' to something else like 'slots' or 'appointment_slots'
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='slots')  # Changed here!
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_number = models.IntegerField(default=1)
    slot_duration = models.IntegerField(default=10)
    is_booked = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['doctor', 'date', 'start_time']
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"Dr. {self.doctor.user.get_full_name()} - {self.date} {self.start_time}-{self.end_time} (Slot #{self.slot_number})"
    
    @property
    def display_name(self):
        return f"Slot #{self.slot_number}: {self.start_time.strftime('%I:%M %p')} - {self.end_time.strftime('%I:%M %p')}"