from rest_framework import serializers
from .models import Appointment, Consultation
from patients.serializers import PatientSerializer
from userauth.serializers import StaffSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = StaffSerializer(source='doctor', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'

class ConsultationSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = StaffSerializer(source='doctor', read_only=True)
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = Consultation
        fields = '__all__'