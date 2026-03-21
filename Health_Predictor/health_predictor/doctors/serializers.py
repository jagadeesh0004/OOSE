from rest_framework import serializers
from doctors.models import TimeSlot
from accounts.models import DoctorProfile
from accounts.serializers import UserSerializer
from datetime import date

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    available_days = serializers.JSONField(required=False)
    time_slots = serializers.JSONField(required=False)
    slot_duration = serializers.IntegerField(required=False)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'
    
    def validate_time_slots(self, value):
        """Validate time slots format"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Time slots must be a list")
        
        for slot in value:
            if not isinstance(slot, dict):
                raise serializers.ValidationError("Each time slot must be an object")
            
            if 'start' not in slot or 'end' not in slot:
                raise serializers.ValidationError("Each time slot must have 'start' and 'end' times")
            
            # Validate time format
            try:
                from datetime import datetime
                start = datetime.strptime(slot['start'], '%H:%M').time()
                end = datetime.strptime(slot['end'], '%H:%M').time()
                
                if start >= end:
                    raise serializers.ValidationError(f"Start time {slot['start']} must be before end time {slot['end']}")
            except ValueError:
                raise serializers.ValidationError("Invalid time format. Use HH:MM (24-hour format)")
        
        return value
    
    def validate_slot_duration(self, value):
        """Validate slot duration"""
        if value < 5 or value > 120:
            raise serializers.ValidationError("Slot duration must be between 5 and 120 minutes")
        return value


# ============= THIS IS THE TimeSlotSerializer YOU NEED =============
class TimeSlotSerializer(serializers.ModelSerializer):
    """Serializer for displaying time slots"""
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    day = serializers.SerializerMethodField()
    
    class Meta:
        model = TimeSlot
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialization',
            'date', 'day', 'start_time', 'end_time', 
            'slot_number', 'slot_duration', 'is_booked'
        ]
        read_only_fields = ['slot_number', 'is_booked']
    
    def get_day(self, obj):
        """Get day name from date"""
        return obj.date.strftime('%A') if obj.date else None


# ============= THIS IS THE CreateTimeSlotSerializer YOU NEED =============
class CreateTimeSlotSerializer(serializers.ModelSerializer):
    """Serializer for creating individual time slots"""
    class Meta:
        model = TimeSlot
        fields = ['date', 'start_time', 'end_time']
    
    def validate_date(self, value):
        """Ensure date is not in the past"""
        if value < date.today():
            raise serializers.ValidationError("Cannot create slots for past dates")
        return value
    
    def validate(self, data):
        """Validate time range"""
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time")
        return data
    
    def create(self, validated_data):
        """Create a time slot with auto-generated slot number"""
        doctor = self.context['doctor']
        
        # Get the next slot number for this date
        existing_slots = TimeSlot.objects.filter(
            doctor=doctor,
            date=validated_data['date']
        ).count()
        
        slot_number = existing_slots + 1
        
        # Create the slot
        time_slot = TimeSlot.objects.create(
            doctor=doctor,
            slot_number=slot_number,
            **validated_data
        )
        
        return time_slot


# Optional additional serializers you might need
class AvailableSlotSerializer(serializers.ModelSerializer):
    """Serializer for showing available slots to patients"""
    doctor_id = serializers.IntegerField(source='doctor.id', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    consultation_fee = serializers.DecimalField(source='doctor.consultation_fee', max_digits=10, decimal_places=2, read_only=True)
    day = serializers.SerializerMethodField()
    
    class Meta:
        model = TimeSlot
        fields = [
            'id', 'doctor_id', 'doctor_name', 'doctor_specialization',
            'consultation_fee', 'date', 'day', 'start_time', 'end_time',
            'slot_number', 'slot_duration'
        ]
    
    def get_day(self, obj):
        return obj.date.strftime('%A') if obj.date else None


class DateRangeSlotGeneratorSerializer(serializers.Serializer):
    """Serializer for validating date range input"""
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    
    def validate(self, data):
        """Validate date range"""
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date must be before end date")
        
        if data['start_date'] < date.today():
            raise serializers.ValidationError("Start date cannot be in the past")
        
        return data