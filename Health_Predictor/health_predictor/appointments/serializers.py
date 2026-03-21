from rest_framework import serializers
from .models import Appointment
from doctors.models import TimeSlot
from doctors.serializers import TimeSlotSerializer
from accounts.serializers import UserSerializer
from datetime import date, datetime
from doctors.models import TimeSlot, DoctorProfile

class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for retrieving appointment details"""
    patient_details = UserSerializer(source='patient', read_only=True)
    time_slot_details = TimeSlotSerializer(source='time_slot', read_only=True)
    doctor_name = serializers.CharField(source='time_slot.doctor.user.get_full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='time_slot.doctor.specialization', read_only=True)
    appointment_date = serializers.DateField(source='time_slot.date', read_only=True)
    appointment_time = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_details', 'time_slot', 'time_slot_details',
            'doctor_name', 'doctor_specialization', 'appointment_date', 'appointment_time',
            'status', 'symptoms', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['patient', 'status', 'created_at', 'updated_at']
    
    def get_appointment_time(self, obj):
        return f"{obj.time_slot.start_time} - {obj.time_slot.end_time}"



class BookAppointmentSerializer(serializers.Serializer):
    """Serializer for booking an appointment using doctor_id, date, start_time, and optional slot_number"""
    doctor_id = serializers.IntegerField()
    date = serializers.DateField()
    start_time = serializers.TimeField()
    slot_number = serializers.IntegerField(min_value=1, required=False)
    symptoms = serializers.CharField(max_length=500)
    
    def validate(self, data):
        doctor_id = data['doctor_id']
        appointment_date = data['date']
        start_time = data['start_time']
        
        # Check if doctor exists
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            raise serializers.ValidationError({"doctor_id": "Doctor not found"})
        
        # Check if date is in the past
        if appointment_date < date.today():
            raise serializers.ValidationError({"date": "Cannot book appointments for past dates"})
        
        # Find the specific time slot using unique constraint (doctor, date, start_time)
        try:
            time_slot = TimeSlot.objects.select_for_update().get(
                doctor=doctor,
                date=appointment_date,
                start_time=start_time,
                is_booked=False
            )
        except TimeSlot.DoesNotExist:
            raise serializers.ValidationError(
                f"Slot at {start_time} on {appointment_date} is not available for this doctor"
            )
        
        # Check if slot is for today but time has passed
        if appointment_date == date.today() and start_time < datetime.now().time():
            raise serializers.ValidationError(
                {"start_time": "Cannot book appointments for past times"}
            )
        
        # Check if patient already has an appointment at this time
        patient = self.context['request'].user
        existing = Appointment.objects.filter(
            patient=patient,
            time_slot__date=appointment_date,
            time_slot__start_time=start_time,
            status__in=['pending', 'confirmed']
        ).exists()
        
        if existing:
            raise serializers.ValidationError(
                "You already have an appointment at this time"
            )
        
        # Store the found time_slot in context for create method
        self.context['time_slot'] = time_slot
        return data
    
    def create(self, validated_data):
        time_slot = self.context['time_slot']
        symptoms = validated_data['symptoms']
        
        # Mark the time slot as booked
        time_slot.is_booked = True
        time_slot.save()
        
        # Create the appointment
        appointment = Appointment.objects.create(
            patient=self.context['request'].user,
            time_slot=time_slot,
            symptoms=symptoms,
            status='confirmed'
        )
        
        return appointment
class UpdateAppointmentStatusSerializer(serializers.ModelSerializer):
    """Serializer for updating appointment status (for doctors)"""
    class Meta:
        model = Appointment
        fields = ['status', 'notes']
    
    def validate_status(self, value):
        if value not in ['confirmed', 'completed', 'cancelled']:
            raise serializers.ValidationError("Invalid status")
        return value


class CancelAppointmentSerializer(serializers.Serializer):
    """Serializer for cancelling an appointment"""
    reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        appointment = self.context['appointment']
        
        # Check if appointment can be cancelled
        if appointment.status == 'completed':
            raise serializers.ValidationError("Cannot cancel a completed appointment")
        
        if appointment.status == 'cancelled':
            raise serializers.ValidationError("Appointment is already cancelled")
        
        return data