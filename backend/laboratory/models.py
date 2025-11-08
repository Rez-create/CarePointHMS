from django.db import models
from django.utils import timezone
from userauth.models import Staff
from patients.models import Patient
from appointments.models import Appointment

class LabRequest(models.Model):
    PRIORITY_CHOICES = [
        ('routine', 'Routine'),
        ('urgent', 'Urgent'),
        ('emergency', 'Emergency'),
    ]

    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('sample_collected', 'Sample Collected'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=100)
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='routine')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    request_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.patient} - {self.test_name} - {self.request_date}"

class LabResult(models.Model):
    request = models.OneToOneField(LabRequest, on_delete=models.CASCADE)
    test_value = models.CharField(max_length=100)
    is_abnormal = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    performed_by = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='lab_tests_performed')
    verified_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name='lab_tests_verified')
    result_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.request.patient} - {self.request.test_name} - {self.result_date}"
