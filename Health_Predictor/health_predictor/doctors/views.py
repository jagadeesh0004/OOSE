from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from datetime import datetime, date, timedelta

from accounts.models import DoctorProfile
from doctors.models import TimeSlot
from .serializers import DoctorProfileSerializer, TimeSlotSerializer,CreateTimeSlotSerializer

from .utils import generate_time_slots, format_slot_display

# ==================== PROFILE MANAGEMENT VIEWS ====================

class CreateDoctorProfileView(generics.CreateAPIView):
    """Create doctor profile (after user registration)"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Check if user is a doctor
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Only doctors can create doctor profiles'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if profile already exists
        if DoctorProfile.objects.filter(user=request.user).exists():
            return Response(
                {'error': 'Doctor profile already exists for this user'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user_id to the data
        data = request.data.copy()
        data['user_id'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        doctor_profile = serializer.save()
        
        return Response({
            'message': 'Doctor profile created successfully',
            'doctor_profile': DoctorProfileSerializer(doctor_profile).data
        }, status=status.HTTP_201_CREATED)


class CheckDoctorProfileView(APIView):
    """Check if doctor profile exists for logged-in user"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            doctor_profile = DoctorProfile.objects.get(user=request.user)
            serializer = DoctorProfileSerializer(doctor_profile)
            return Response({
                'exists': True,
                'profile': serializer.data
            })
        except DoctorProfile.DoesNotExist:
            return Response({
                'exists': False,
                'message': 'Doctor profile not found. Please create your profile.'
            })


class GetDoctorProfileView(generics.RetrieveAPIView):
    """Get doctor profile for logged-in user"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(DoctorProfile, user=self.request.user)


class UpdateDoctorProfileView(generics.UpdateAPIView):
    """Update doctor profile"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(DoctorProfile, user=self.request.user)


# ==================== PUBLIC DOCTOR VIEWING (FOR PATIENTS) ====================

class DoctorListView(generics.ListAPIView):
    """List all available doctors (for patients)"""
    queryset = DoctorProfile.objects.filter(is_available=True)
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorDetailView(generics.RetrieveAPIView):
    """Get specific doctor details (for patients)"""
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class AvailableSlotsView(generics.ListAPIView):
    """Get available slots for a specific doctor (for patients to book)"""
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return TimeSlot.objects.filter(
            doctor_id=doctor_id,
            is_booked=False,
            date__gte=date.today()
        ).order_by('date', 'start_time')


# ==================== SLOT MANAGEMENT FOR DOCTORS ====================

class GenerateTimeSlotsView(APIView):
    """Generate slots for a specific date range based on doctor's time patterns"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Check if user is doctor
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Only doctors can generate slots'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get doctor profile
        try:
            doctor = DoctorProfile.objects.get(user=request.user)
        except DoctorProfile.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found. Please create profile first.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get date range from request
        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')
        
        if not start_date_str or not end_date_str:
            return Response(
                {'error': 'Please provide start_date and end_date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate date format
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate date range
        if start_date > end_date:
            return Response(
                {'error': 'Start date must be before end date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if start_date < date.today():
            return Response(
                {'error': 'Start date cannot be in the past'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate slots using utility function
        from .utils import generate_time_slots
        generated_slots = generate_time_slots(doctor, start_date, end_date)
        
        # Save slots to database (avoid duplicates)
        created_slots = []
        skipped_slots = []
        slots_by_date = {}
        
        for slot_data in generated_slots:
            # Check if slot already exists
            existing = TimeSlot.objects.filter(
                doctor=doctor,
                date=slot_data['date'],
                start_time=slot_data['start_time']
            ).exists()
            
            if not existing:
                slot = TimeSlot.objects.create(**slot_data)
                created_slots.append(slot)
                
                # Group by date for response
                date_str = slot.date.strftime('%Y-%m-%d')
                if date_str not in slots_by_date:
                    slots_by_date[date_str] = {
                        'date': date_str,
                        'day': slot.date.strftime('%A'),
                        'slots': []
                    }
                
                slots_by_date[date_str]['slots'].append({
                    'slot_number': slot.slot_number,
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M')
                })
            else:
                skipped_slots.append({
                    'date': slot_data['date'].strftime('%Y-%m-%d'),
                    'time': slot_data['start_time'].strftime('%H:%M')
                })
        
        return Response({
            'message': f'Successfully generated {len(created_slots)} new slots',
            'date_range': {
                'start': start_date.strftime('%Y-%m-%d'),
                'end': end_date.strftime('%Y-%m-%d'),
                'total_days': (end_date - start_date).days + 1
            },
            'total_created': len(created_slots),
            'total_skipped': len(skipped_slots),
            'slots_by_date': list(slots_by_date.values())
        })


class DoctorSlotsView(generics.ListAPIView):
    """Get all slots for the logged-in doctor"""
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'doctor':
            return TimeSlot.objects.none()
        
        try:
            doctor = DoctorProfile.objects.get(user=self.request.user)
            queryset = TimeSlot.objects.filter(doctor=doctor)
            
            # Filter by date if provided
            date_param = self.request.query_params.get('date')
            if date_param:
                queryset = queryset.filter(date=date_param)
            else:
                # Show future slots by default
                queryset = queryset.filter(date__gte=date.today())
            
            return queryset.order_by('date', 'start_time')
        
        except DoctorProfile.DoesNotExist:
            return TimeSlot.objects.none()


class DeleteTimeSlotView(APIView):
    """Delete a time slot by ID"""
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, pk):
        # Check if user is doctor
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Only doctors can delete slots'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get doctor profile
        try:
            doctor = DoctorProfile.objects.get(user=request.user)
        except DoctorProfile.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Find the slot by ID
        try:
            time_slot = TimeSlot.objects.get(id=pk, doctor=doctor)
        except TimeSlot.DoesNotExist:
            return Response(
                {'error': 'Slot not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if slot is booked
        if time_slot.is_booked:
            return Response(
                {'error': 'Cannot delete a booked time slot'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete the slot
        time_slot.delete()
        
        return Response({
            'message': f'Slot #{time_slot.slot_number} on {time_slot.date} deleted successfully'
        })

class DeleteAllSlotsView(APIView):
    """Delete all future slots for the logged-in doctor"""
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Only doctors can delete slots'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            doctor = DoctorProfile.objects.get(user=request.user)
            # Delete only future slots that are not booked
            deleted_count = TimeSlot.objects.filter(
                doctor=doctor,
                date__gte=date.today(),
                is_booked=False
            ).delete()[0]
            
            return Response({
                'message': f'Successfully deleted {deleted_count} future available slots'
            })
        except DoctorProfile.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class DeleteTimeSlotViewByDate(APIView):
    """Delete a time slot by date and slot number using JSON input"""
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        try:
            print("="*50)
            print("Starting DeleteTimeSlotViewByDate")
            print(f"User: {request.user.username}, Type: {request.user.user_type}")
            print(f"Request data: {request.data}")
            print(f"Content-Type: {request.content_type}")
            
            # Check if user is doctor
            if request.user.user_type != 'doctor':
                print("ERROR: User is not a doctor")
                return Response(
                    {'error': 'Only doctors can delete slots'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get doctor profile
            try:
                doctor = DoctorProfile.objects.get(user=request.user)
                print(f"Doctor profile found: {doctor.id}")
            except DoctorProfile.DoesNotExist:
                print("ERROR: Doctor profile not found")
                return Response(
                    {'error': 'Doctor profile not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get parameters from request body (JSON)
            date_str = request.data.get('date')
            slot_number = request.data.get('slot_number')
            
            print(f"Extracted - date: {date_str}, slot_number: {slot_number}")
            
            if not date_str or not slot_number:
                print("ERROR: Missing date or slot_number")
                return Response(
                    {'error': 'Please provide both date and slot_number in JSON format'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate and find slot
            try:
                from datetime import datetime
                print(f"Parsing date: {date_str}")
                slot_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                print(f"Parsed date: {slot_date}")
                
                print(f"Converting slot_number: {slot_number}")
                slot_number = int(slot_number)
                print(f"Converted slot_number: {slot_number}")
                
                print(f"Looking for slot with doctor={doctor.id}, date={slot_date}, slot_number={slot_number}")
                time_slot = TimeSlot.objects.get(
                    doctor=doctor,
                    date=slot_date,
                    slot_number=slot_number
                )
                print(f"Found slot: {time_slot.id}")
                
            except ValueError as e:
                print(f"ValueError: {e}")
                return Response(
                    {'error': f'Invalid date format. Use YYYY-MM-DD. Error: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except TimeSlot.DoesNotExist:
                print(f"Slot not found: #{slot_number} on {date_str}")
                return Response(
                    {'error': f'Slot #{slot_number} on {date_str} not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                print(f"Unexpected error finding slot: {e}")
                return Response(
                    {'error': f'Error finding slot: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Check if booked
            if time_slot.is_booked:
                print(f"Slot is booked: {time_slot.is_booked}")
                return Response(
                    {'error': 'Cannot delete a booked time slot'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Store info before deletion
            deleted_date = time_slot.date
            deleted_slot_number = time_slot.slot_number
            print(f"Deleting slot: #{deleted_slot_number} on {deleted_date}")
            
            # Delete the slot
            time_slot.delete()
            print("Slot deleted successfully")
            
            # Re-number remaining slots
            print("Re-numbering remaining slots...")
            remaining_slots = TimeSlot.objects.filter(
                doctor=doctor,
                date=deleted_date
            ).order_by('start_time')
            
            print(f"Found {remaining_slots.count()} remaining slots")
            
            for index, slot in enumerate(remaining_slots, 1):
                if slot.slot_number != index:
                    print(f"Updating slot {slot.id} from #{slot.slot_number} to #{index}")
                    slot.slot_number = index
                    slot.save()
            
            print("Re-numbering complete")
            print("="*50)
            
            return Response({
                'message': f'Slot #{deleted_slot_number} on {deleted_date} deleted successfully',
                'remaining_slots': remaining_slots.count()
            })
            
        except Exception as e:
            print(f"UNHANDLED EXCEPTION: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# ==================== ADD INDIVIDUAL SLOT (OPTIONAL) ====================

class AddSingleTimeSlotView(generics.CreateAPIView):
    """Add a single time slot manually"""
    serializer_class = CreateTimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Check if user is a doctor
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Only doctors can add time slots'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if doctor profile exists
        try:
            doctor = DoctorProfile.objects.get(user=request.user)
        except DoctorProfile.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Pass doctor to serializer context
        serializer = self.get_serializer(data=request.data, context={'doctor': doctor})
        serializer.is_valid(raise_exception=True)
        time_slot = serializer.save()
        
        return Response({
            'message': 'Time slot added successfully',
            'time_slot': TimeSlotSerializer(time_slot).data
        }, status=status.HTTP_201_CREATED)