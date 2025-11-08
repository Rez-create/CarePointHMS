from django.contrib import admin
from .models import LabRequest, LabResult

class LabResultInline(admin.StackedInline):
    model = LabResult
    extra = 0

@admin.register(LabRequest)
class LabRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'test_name', 'priority', 'status', 'request_date')
    list_filter = ('status', 'priority', 'request_date')
    search_fields = ('patient__first_name', 'patient__last_name', 'test_name')
    date_hierarchy = 'request_date'
    inlines = [LabResultInline]

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'request', 'is_abnormal', 'performed_by', 'verified_by', 'result_date')
    list_filter = ('is_abnormal', 'result_date')
    search_fields = ('request__patient__first_name', 'request__patient__last_name', 'test_value', 'notes')
    date_hierarchy = 'result_date'
