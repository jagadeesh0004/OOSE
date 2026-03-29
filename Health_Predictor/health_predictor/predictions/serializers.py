from rest_framework import serializers
from .models import HealthPrediction
from doctors.models import DoctorProfile, TimeSlot
from datetime import date

class HealthPredictionInputSerializer(serializers.Serializer):
    """Serializer for validating prediction input"""
    age = serializers.IntegerField(min_value=1, max_value=120)
    gender = serializers.ChoiceField(choices=['male', 'female'])
    weight = serializers.FloatField(min_value=20, max_value=300)
    height = serializers.FloatField(min_value=50, max_value=250)
    temperature = serializers.FloatField(min_value=35, max_value=42)  # Celsius
    blood_pressure = serializers.FloatField(min_value=50, max_value=250)
    sleep = serializers.FloatField(min_value=0, max_value=24)
    heart_rate = serializers.IntegerField(min_value=30, max_value=200)
    smoking = serializers.ChoiceField(choices=['yes', 'no'])
    alcohol = serializers.ChoiceField(choices=['yes', 'no'])

class HealthPredictionSerializer(serializers.ModelSerializer):
    """Serializer for prediction output"""
    class Meta:
        model = HealthPrediction
        fields = '__all__'
        read_only_fields = ['user', 'risk_level', 'risk_score', 'prescription', 'created_at']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Add doctor recommendations for high risk predictions
        if instance.risk_level == 'high':
            # Get all active and available doctors
            doctors = DoctorProfile.objects.filter(
                is_available=True,
                user__is_active=True
            ).select_related('user')
            
            # Filter doctors to only those with available slots (not booked)
            today = date.today()
            doctors_with_slots = []
            
            for doctor in doctors:
                # Check if doctor has at least one available slot (not booked, from today onwards)
                has_available_slot = TimeSlot.objects.filter(
                    doctor=doctor,
                    is_booked=False,
                    date__gte=today
                ).exists()
                
                if has_available_slot:
                    doctors_with_slots.append(doctor)
            
            # Build response with doctors who have slots
            available_doctors = [
                {
                    'id': doctor.id,
                    'name': doctor.user.get_full_name() or doctor.user.username,
                    'specialization': doctor.specialization,
                    'hospital': doctor.hospital_name,
                    'fee': str(doctor.consultation_fee),
                    'experience': doctor.experience_years if hasattr(doctor, 'experience_years') else 'N/A'
                }
                for doctor in doctors_with_slots
            ]
            
            if available_doctors:
                data['available_doctors'] = available_doctors
                data['doctors_available'] = True
            else:
                data['available_doctors'] = []
                data['doctors_available'] = False
                data['hospital_message'] = '🏥 No doctors with available slots at the moment. Please visit your nearest hospital for immediate medical attention.'
        
        return data