from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Staff, StaffSchedule

class StaffScheduleInline(admin.TabularInline):
    model = StaffSchedule
    extra = 1

@admin.register(Staff)
class StaffAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'status')
    list_filter = ('role', 'status', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Staff Information', {'fields': ('role', 'specialization', 'phone', 'status')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Staff Information', {
            'classes': ('wide',),
            'fields': ('role', 'specialization', 'phone', 'status'),
        }),
    )
    inlines = [StaffScheduleInline]

@admin.register(StaffSchedule)
class StaffScheduleAdmin(admin.ModelAdmin):
    list_display = ('staff', 'day_of_week', 'start_time', 'end_time', 'is_active')
    list_filter = ('day_of_week', 'is_active')
    search_fields = ('staff__username', 'staff__first_name', 'staff__last_name')
