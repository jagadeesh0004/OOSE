from django.urls import path
from . import views

urlpatterns = [
    # Patient endpoints
    path('book/', views.BookAppointmentView.as_view(), name='book-appointment'),
    path('my-appointments/', views.PatientAppointmentsView.as_view(), name='patient-appointments'),
    path('cancel/<int:pk>/', views.CancelAppointmentView.as_view(), name='cancel-appointment'),
    
    # Doctor endpoints
    path('doctor/appointments/', views.DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    path('doctor/today/', views.TodaysAppointmentsView.as_view(), name='today-appointments'),
    path('doctor/update-status/<int:pk>/', views.UpdateAppointmentStatusView.as_view(), name='update-status'),
    
    # Common endpoints
    path('upcoming/', views.UpcomingAppointmentsView.as_view(), name='upcoming-appointments'),
    path('<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('check-slot/<int:slot_id>/', views.CheckSlotAvailabilityView.as_view(), name='check-slot'),
    
    # Public/Doctor specific slots
    path('doctor/<int:doctor_id>/available-slots/', views.AvailableSlotsForDoctorView.as_view(), name='doctor-available-slots'),
]