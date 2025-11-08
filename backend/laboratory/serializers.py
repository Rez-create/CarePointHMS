from rest_framework import serializers
from .models import LabRequest, LabResult
from patients.serializers import PatientSerializer
from userauth.serializers import StaffSerializer

class LabRequestSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = StaffSerializer(source='doctor', read_only=True)

    class Meta:
        model = LabRequest
        fields = '__all__'

class LabResultSerializer(serializers.ModelSerializer):
    request_details = LabRequestSerializer(source='request', read_only=True)
    performed_by_details = StaffSerializer(source='performed_by', read_only=True)
    verified_by_details = StaffSerializer(source='verified_by', read_only=True)

    class Meta:
        model = LabResult
        fields = '__all__'