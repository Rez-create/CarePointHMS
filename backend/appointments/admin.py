from django.contrib import admin
from .models import Appointment, Consultation

class ConsultationInline(admin.StackedInline):
    model = Consultation
    extra = 0

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'appointment_type', 'appointment_datetime', 'status')
    list_filter = ('status', 'appointment_type', 'appointment_datetime')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name')
    date_hierarchy = 'appointment_datetime'
    inlines = [ConsultationInline]

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('id', 'appointment', 'patient', 'doctor', 'consultation_datetime', 'follow_up_needed')
    list_filter = ('follow_up_needed', 'consultation_datetime')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name', 'diagnosis')
    date_hierarchy = 'consultation_datetime'
