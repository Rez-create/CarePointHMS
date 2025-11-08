from django.contrib import admin
from .models import Supplier, Inventory, Prescription, PrescriptionDetail

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('id', 'supplier_name', 'contact_person', 'contact_email', 'contact_phone')
    search_fields = ('supplier_name', 'contact_person', 'contact_email')

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'item_name', 'category', 'quantity_in_stock', 'unit_price', 'supplier', 'expiry_date')
    list_filter = ('category', 'supplier')
    search_fields = ('item_name', 'description', 'batch_number')
    date_hierarchy = 'expiry_date'

class PrescriptionDetailInline(admin.TabularInline):
    model = PrescriptionDetail
    extra = 1

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'status', 'prescribed_date')
    list_filter = ('status', 'prescribed_date')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name')
    date_hierarchy = 'prescribed_date'
    inlines = [PrescriptionDetailInline]

@admin.register(PrescriptionDetail)
class PrescriptionDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'prescription', 'medication', 'dosage', 'quantity', 'dispensed_by', 'dispensed_date')
    list_filter = ('dispensed_date',)
    search_fields = ('prescription__patient__first_name', 'prescription__patient__last_name', 'medication__item_name')
