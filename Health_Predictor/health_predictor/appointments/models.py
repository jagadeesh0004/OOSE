from django.db import models
from django.contrib.auth import get_user_model
from doctors.models import TimeSlot

User = get_user_model()

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    time_slot = models.OneToOneField(TimeSlot, on_delete=models.CASCADE, related_name='appointment')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    symptoms = models.TextField()
    notes = models.TextField(blank=True, null=True)  # Doctor's notes after appointment
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Appointment: {self.patient.username} with Dr. {self.time_slot.doctor.user.get_full_name()} on {self.time_slot.date} at {self.time_slot.start_time}"
    
    @property
    def doctor(self):
        return self.time_slot.doctor
    
    @property
    def appointment_date(self):
        return self.time_slot.date
    
    @property
    def appointment_time(self):
        return f"{self.time_slot.start_time} - {self.time_slot.end_time}"