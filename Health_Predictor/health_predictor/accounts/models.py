from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    phone_number = models.CharField(max_length=15)
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} - {self.user_type}"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=5)
    emergency_contact = models.CharField(max_length=15)
    medical_history = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"Patient: {self.user.username}"

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100)
    qualification = models.CharField(max_length=200)
    experience_years = models.IntegerField()
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    
    # New fields for slot generation
    available_days = models.JSONField(default=list)  # Stores ["Monday", "Wednesday", "Friday"]
    time_slots = models.JSONField(default=list)      # Stores [{"start": "09:00", "end": "12:00"}, {"start": "14:00", "end": "17:00"}]
    consultation_duration = models.IntegerField(default=30, help_text="Duration in minutes")
    slot_duration = models.IntegerField(default=10, help_text="Each appointment slot duration in minutes")
    
    hospital_name = models.CharField(max_length=200)
    hospital_address = models.TextField()
    is_available = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}" 
