from django.urls import path
from . import views

urlpatterns = [
    # Profile Management
    path('create-profile/', views.CreateDoctorProfileView.as_view(), name='create-doctor-profile'),
    path('check-profile/', views.CheckDoctorProfileView.as_view(), name='check-doctor-profile'),
    path('my-profile/', views.GetDoctorProfileView.as_view(), name='get-doctor-profile'),
    path('update-profile/', views.UpdateDoctorProfileView.as_view(), name='update-doctor-profile'),
    
    # Slot Management
    path('generate-slots/', views.GenerateTimeSlotsView.as_view(), name='generate-slots'),
    path('my-slots/', views.DoctorSlotsView.as_view(), name='my-slots'),
    path('add-slot/', views.AddSingleTimeSlotView.as_view(), name='add-single-slot'),
    path('delete-slot/<int:pk>/', views.DeleteTimeSlotView.as_view(), name='delete-slot'),
    path('delete-slot/', views.DeleteTimeSlotViewByDate.as_view(), name='delete-slot'),
    path('delete-all-slots/', views.DeleteAllSlotsView.as_view(), name='delete-all-slots'),
    
    # Public endpoints (for patients)
    path('list/', views.DoctorListView.as_view(), name='doctor-list'),
    path('<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('<int:doctor_id>/available-slots/', views.AvailableSlotsView.as_view(), name='available-slots'),
]