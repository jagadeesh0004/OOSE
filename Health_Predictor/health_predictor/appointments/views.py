from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import date, datetime
from doctors.serializers import TimeSlotSerializer
from .models import Appointment
from doctors.models import TimeSlot, DoctorProfile
from .serializers import (
    AppointmentSerializer, 
    BookAppointmentSerializer,
    UpdateAppointmentStatusSerializer,
    CancelAppointmentSerializer
)


class AvailableSlotsForDoctorView(generics.ListAPIView):
    """Get all available slots for a specific doctor"""
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        return TimeSlot.objects.filter(
            doctor_id=doctor_id,
            is_booked=False,
            date__gte=date.today()
        ).order_by('date', 'start_time')


class BookAppointmentView(APIView):
    """Book an appointment using doctor_id, date, and slot_number"""
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        try:
            # Check if user is patient
            if request.user.user_type != 'patient':
                return Response(
                    {'error': 'Only patients can book appointments'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = BookAppointmentSerializer(
                data=request.data, 
                context={'request': request}
            )
            

            if serializer.is_valid():
                appointment = serializer.save()

                
                from calendar import day_name
                day_name = appointment.time_slot.date.strftime('%A')


                return Response({
                    'message': 'Appointment booked successfully',
                    'appointment': {
                        'id': appointment.id,
                        'doctor': appointment.time_slot.doctor.user.get_full_name(),
                        'specialization': appointment.time_slot.doctor.specialization,
                        'date': appointment.time_slot.date,
                        'day': day_name,
                        'start_time': appointment.time_slot.start_time,
                        'end_time': appointment.time_slot.end_time,
                        'slot_number': appointment.time_slot.slot_number,
                        'symptoms': appointment.symptoms,
                        'status': appointment.status
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': f'Booking failed: {str(e)}. This slot may have just been booked. Please try another slot.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PatientAppointmentsView(generics.ListAPIView):
    """Get all appointments for the logged-in patient"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'patient':
            return Appointment.objects.filter(
                patient=self.request.user
            ).order_by('-time_slot__date', '-time_slot__start_time')
        return Appointment.objects.none()


class DoctorAppointmentsView(generics.ListAPIView):
    """Get all appointments for the logged-in doctor"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'doctor':
            try:
                doctor = DoctorProfile.objects.get(user=self.request.user)
                return Appointment.objects.filter(
                    time_slot__doctor=doctor
                ).order_by('-time_slot__date', '-time_slot__start_time')
            except DoctorProfile.DoesNotExist:
                return Appointment.objects.none()
        return Appointment.objects.none()


class AppointmentDetailView(generics.RetrieveAPIView):
    """Get details of a specific appointment"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            try:
                doctor = DoctorProfile.objects.get(user=user)
                return Appointment.objects.filter(time_slot__doctor=doctor)
            except DoctorProfile.DoesNotExist:
                return Appointment.objects.none()
        return Appointment.objects.none()


class CancelAppointmentView(APIView):
    """Cancel an appointment (patient can cancel their own)"""
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def delete(self, request, pk):
        try:
            appointment = Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is authorized to cancel
        if request.user.user_type == 'patient' and appointment.patient != request.user:
            return Response(
                {'error': 'You can only cancel your own appointments'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if appointment can be cancelled
        if appointment.status == 'completed':
            return Response(
                {'error': 'Cannot cancel a completed appointment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if appointment.status == 'cancelled':
            return Response(
                {'error': 'Appointment is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate with serializer
        serializer = CancelAppointmentSerializer(
            data=request.data, 
            context={'appointment': appointment}
        )
        serializer.is_valid(raise_exception=True)
        
        # Update appointment status
        appointment.status = 'cancelled'
        appointment.save()
        
        # Free up the time slot
        time_slot = appointment.time_slot
        time_slot.is_booked = False
        time_slot.save()
        
        return Response({
            'message': 'Appointment cancelled successfully',
            'appointment': AppointmentSerializer(appointment).data
        })
    
    def post(self, request, pk):
        # Delegate to delete method for backward compatibility
        return self.delete(request, pk)


class UpdateAppointmentStatusView(APIView):
    """Update appointment status (for doctors only)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, pk):
        # Check if user is doctor
        if request.user.user_type != 'doctor':
            return Response(
                {'error': 'Only doctors can update appointment status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            appointment = Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Prevent any changes to cancelled appointments
        if appointment.status == 'cancelled':
            return Response(
                {'error': 'Cannot update a cancelled appointment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if this appointment belongs to this doctor
        try:
            doctor = DoctorProfile.objects.get(user=request.user)
            if appointment.time_slot.doctor != doctor:
                return Response(
                    {'error': 'This appointment is not for you'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except DoctorProfile.DoesNotExist:
            return Response(
                {'error': 'Doctor profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UpdateAppointmentStatusSerializer(
            appointment, 
            data=request.data, 
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # If status is changed to cancelled, free up the slot
        if serializer.validated_data.get('status') == 'cancelled':
            appointment.time_slot.is_booked = False
            appointment.time_slot.save()
        
        return Response({
            'message': f'Appointment status updated to {appointment.status}',
            'appointment': AppointmentSerializer(appointment).data
        })
    
    def post(self, request, pk):
        # Delegate to patch method for backward compatibility
        return self.patch(request, pk)


class TodaysAppointmentsView(generics.ListAPIView):
    """Get today's appointments for the logged-in doctor"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type == 'doctor':
            try:
                doctor = DoctorProfile.objects.get(user=self.request.user)
                return Appointment.objects.filter(
                    time_slot__doctor=doctor,
                    time_slot__date=date.today(),
                    status__in=['confirmed', 'pending']
                ).order_by('time_slot__start_time')
            except DoctorProfile.DoesNotExist:
                return Appointment.objects.none()
        return Appointment.objects.none()


class UpcomingAppointmentsView(generics.ListAPIView):
    """Get upcoming appointments for the logged-in user (patient or doctor)"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'patient':
            return Appointment.objects.filter(
                patient=user,
                time_slot__date__gte=date.today(),
                status__in=['confirmed', 'pending']
            ).order_by('time_slot__date', 'time_slot__start_time')
        
        elif user.user_type == 'doctor':
            try:
                doctor = DoctorProfile.objects.get(user=user)
                return Appointment.objects.filter(
                    time_slot__doctor=doctor,
                    time_slot__date__gte=date.today(),
                    status__in=['confirmed', 'pending']
                ).order_by('time_slot__date', 'time_slot__start_time')
            except DoctorProfile.DoesNotExist:
                return Appointment.objects.none()
        
        return Appointment.objects.none()


class CheckSlotAvailabilityView(APIView):
    """Check if a specific time slot is available"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, slot_id):
        try:
            time_slot = TimeSlot.objects.get(id=slot_id)
        except TimeSlot.DoesNotExist:
            return Response(
                {'error': 'Time slot not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        is_available = (
            not time_slot.is_booked and 
            time_slot.date >= date.today() and
            not (time_slot.date == date.today() and time_slot.start_time < datetime.now().time())
        )
        
        return Response({
            'slot_id': slot_id,
            'is_available': is_available,
            'date': time_slot.date,
            'start_time': time_slot.start_time,
            'end_time': time_slot.end_time,
            'doctor': time_slot.doctor.user.get_full_name()
        })