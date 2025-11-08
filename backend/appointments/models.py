from django.db import models
from django.utils import timezone
from userauth.models import Staff
from patients.models import Patient

class Appointment(models.Model):
    APPOINTMENT_TYPES = [
        ('initial_visit', 'Initial Visit'),
        ('follow_up', 'Follow Up'),
        ('consultation', 'Consultation'),
        ('procedure', 'Procedure'),
    ]

    STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('confirmed', 'Confirmed'),
        ('checked_in', 'Checked In'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES)
    appointment_datetime = models.DateTimeField()
    reason_for_visit = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    cancellation_reason = models.TextField(blank=True, null=True)
    created_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.appointment_datetime}"

class Consultation(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    chief_complaint = models.TextField()
    diagnosis = models.TextField()
    notes = models.TextField()
    consultation_datetime = models.DateTimeField(default=timezone.now)
    follow_up_needed = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor} - {self.consultation_datetime}"
