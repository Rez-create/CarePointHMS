from rest_framework import serializers
from .models import Patient, MedicalRecord

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    medical_records = MedicalRecordSerializer(many=True, read_only=True, source='medicalrecord_set')
    age = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Patient
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        patient = Patient.objects.create(**validated_data)
        if password:
            patient.set_password(password)
            patient.save()
        return patient

    def get_age(self, obj):
        from datetime import date
        today = date.today()
        born = obj.date_of_birth
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))