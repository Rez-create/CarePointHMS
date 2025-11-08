from django.db import models
from django.utils import timezone
from userauth.models import Staff
from patients.models import Patient
from appointments.models import Consultation

class Supplier(models.Model):
    supplier_name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    address = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.supplier_name

class Inventory(models.Model):
    CATEGORY_CHOICES = [
        ('medicine', 'Medicine'),
        ('equipment', 'Equipment'),
        ('medical_supply', 'Medical Supply'),
        ('lab_supply', 'Lab Supply'),
    ]

    item_name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    quantity_in_stock = models.IntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_level = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)
    expiry_date = models.DateField(null=True, blank=True)
    batch_number = models.CharField(max_length=50, blank=True, null=True)
    storage_location = models.CharField(max_length=100, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.item_name} - {self.batch_number}"

class Prescription(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('dispensed', 'Dispensed'),
        ('cancelled', 'Cancelled'),
    ]

    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='prescriptions_given')
    prescribed_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.patient} - {self.prescribed_date}"

class PrescriptionDetail(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    medication = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    quantity = models.IntegerField()
    instructions = models.TextField(blank=True, null=True)
    dispensed_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)
    dispensed_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.prescription.patient} - {self.medication.item_name}"
