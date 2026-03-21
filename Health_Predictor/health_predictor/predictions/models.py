from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class HealthPrediction(models.Model):
    RISK_LEVELS = (
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions')
    
    # Input fields (matching your model features)
    age = models.IntegerField(default=20)
    gender = models.CharField(default="None",max_length=10)  # 'male' or 'female'
    weight = models.FloatField(help_text="Weight in kg")
    height = models.FloatField(help_text="Height in cm")
    temperature = models.FloatField(default=37,help_text="Body temperature in °F")
    blood_pressure = models.CharField(default=120,max_length=20, help_text="e.g., '120/80'")
    sleep = models.FloatField(help_text="Sleep in hours per day")
    heart_rate = models.IntegerField(default=72,help_text="Heart rate in bpm")
    smoking = models.BooleanField(default=False)
    alcohol = models.BooleanField(default=False)
    
    # Output fields
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS)
    risk_score = models.FloatField(null=True, blank=True)  # If your model gives probability
    prescription = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Prediction for {self.user.username} - {self.risk_level}"