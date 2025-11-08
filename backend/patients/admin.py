from django.contrib import admin
from .models import Patient, MedicalRecord

class MedicalRecordInline(admin.TabularInline):
    model = MedicalRecord
    extra = 1

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'gender', 'contact_phone', 'registration_date')
    list_filter = ('gender', 'registration_date')
    search_fields = ('first_name', 'last_name', 'contact_email', 'contact_phone')
    date_hierarchy = 'registration_date'
    inlines = [MedicalRecordInline]

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'record_type', 'record_date', 'recorded_by')
    list_filter = ('record_type', 'record_date')
    search_fields = ('patient__first_name', 'patient__last_name', 'description')
    date_hierarchy = 'record_date'
