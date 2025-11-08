from django.db import models
from django.utils import timezone
from userauth.models import Staff

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    contact_email = models.EmailField(unique=True)
    contact_phone = models.CharField(max_length=20)
    address = models.TextField()
    registration_date = models.DateTimeField(default=timezone.now)
    profile_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class MedicalRecord(models.Model):
    RECORD_TYPES = [
        ('diagnosis', 'Diagnosis'),
        ('procedure', 'Procedure'),
        ('lab_result', 'Lab Result'),
        ('prescription', 'Prescription'),
        ('immunization', 'Immunization'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    record_type = models.CharField(max_length=20, choices=RECORD_TYPES)
    record_date = models.DateTimeField(default=timezone.now)
    description = models.TextField()
    recorded_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.patient} - {self.record_type} - {self.record_date.date()}"
