from django.contrib import admin
from .models import *
from .models import DoctorProfile, TimeSlot
# Register your models here.


admin.site.register(TimeSlot)


# @admin.register(DoctorProfile)
# class DoctorProfileAdmin(admin.ModelAdmin):
#     list_display = ['user', 'specialization', 'experience_years', 'is_available']
#     search_fields = ['user__username', 'specialization']

# @admin.register(TimeSlot)
# class TimeSlotAdmin(admin.ModelAdmin):
#     list_display = ['doctor', 'date', 'start_time', 'end_time', 'is_booked']
#     list_filter = ['is_booked', 'date']