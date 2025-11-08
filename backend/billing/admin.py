from django.contrib import admin
from .models import ServicePrice, Bill, BillDetail, Payment

class BillDetailInline(admin.TabularInline):
    model = BillDetail
    extra = 1

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0

@admin.register(ServicePrice)
class ServicePriceAdmin(admin.ModelAdmin):
    list_display = ('id', 'service_name', 'price', 'created_date', 'updated_date')
    search_fields = ('service_name', 'description')
    date_hierarchy = 'created_date'

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'total_amount', 'patient_responsibility', 'status', 'issued_date', 'due_date')
    list_filter = ('status', 'issued_date', 'due_date')
    search_fields = ('patient__first_name', 'patient__last_name')
    date_hierarchy = 'issued_date'
    inlines = [BillDetailInline, PaymentInline]

@admin.register(BillDetail)
class BillDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill', 'service', 'item', 'quantity', 'unit_price', 'total')
    search_fields = ('bill__patient__first_name', 'bill__patient__last_name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'bill', 'payment_method', 'amount_paid', 'payment_date', 'received_by')
    list_filter = ('payment_method', 'payment_date')
    search_fields = ('bill__patient__first_name', 'bill__patient__last_name', 'transaction_reference')
    date_hierarchy = 'payment_date'
