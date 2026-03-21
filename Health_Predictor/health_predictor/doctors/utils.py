from datetime import datetime, timedelta
from doctors.models import TimeSlot

def generate_time_slots(doctor_profile, start_date, end_date):
    """
    Generate time slots for each date in the given range
    based on doctor's time patterns and slot duration
    """
    time_ranges = doctor_profile.time_slots  # [{"start": "09:00", "end": "12:00"}]
    slot_duration = doctor_profile.slot_duration  # e.g., 10 minutes
    
    all_slots = []
    current_date = start_date
    
    while current_date <= end_date:
        # For each date, generate slots from each time range
        for time_range in time_ranges:
            start_time = datetime.strptime(time_range['start'], '%H:%M').time()
            end_time = datetime.strptime(time_range['end'], '%H:%M').time()
            
            # Convert to datetime for calculations
            slot_start = datetime.combine(current_date, start_time)
            slot_end = datetime.combine(current_date, end_time)
            
            # Generate slots for this time range
            current_slot_start = slot_start
            
            # Get the next slot number for this date
            existing_slots_count = TimeSlot.objects.filter(
                doctor=doctor_profile,
                date=current_date
            ).count()
            
            slot_number = existing_slots_count + 1
            
            while current_slot_start + timedelta(minutes=slot_duration) <= slot_end:
                slot_end_time = current_slot_start + timedelta(minutes=slot_duration)
                
                slot_data = {
                    'doctor': doctor_profile,
                    'date': current_date,
                    'start_time': current_slot_start.time(),
                    'end_time': slot_end_time.time(),
                    'slot_number': slot_number,
                    'slot_duration': slot_duration,
                    'is_booked': False
                }
                
                all_slots.append(slot_data)
                
                current_slot_start = slot_end_time
                slot_number += 1
        
        current_date += timedelta(days=1)
    
    return all_slots


def format_slot_display(slot):
    """Format a slot for display in responses"""
    return {
        'id': slot.id,
        'date': slot.date.strftime('%Y-%m-%d'),
        'day': slot.date.strftime('%A'),
        'start_time': slot.start_time.strftime('%H:%M'),
        'end_time': slot.end_time.strftime('%H:%M'),
        'slot_number': slot.slot_number,
        'slot_duration': f"{slot.slot_duration} mins",
        'is_booked': slot.is_booked,
        'display': f"Slot #{slot.slot_number}: {slot.start_time.strftime('%I:%M %p')} - {slot.end_time.strftime('%I:%M %p')}"
    }


def get_slots_grouped_by_date(doctor_id, from_date=None):
    """Get slots grouped by date for a doctor"""
    queryset = TimeSlot.objects.filter(doctor_id=doctor_id)
    
    if from_date:
        queryset = queryset.filter(date__gte=from_date)
    else:
        queryset = queryset.filter(date__gte=datetime.now().date())
    
    queryset = queryset.order_by('date', 'start_time')
    
    # Group by date
    slots_by_date = {}
    for slot in queryset:
        date_str = slot.date.strftime('%Y-%m-%d')
        if date_str not in slots_by_date:
            slots_by_date[date_str] = {
                'date': date_str,
                'day': slot.date.strftime('%A'),
                'slots': []
            }
        
        slots_by_date[date_str]['slots'].append({
            'id': slot.id,
            'slot_number': slot.slot_number,
            'start_time': slot.start_time.strftime('%H:%M'),
            'end_time': slot.end_time.strftime('%H:%M'),
            'is_booked': slot.is_booked
        })
    
    return list(slots_by_date.values())