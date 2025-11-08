from rest_framework import serializers
from .models import Supplier, Inventory, Prescription, PrescriptionDetail

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    supplier_details = SupplierSerializer(source='supplier', read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'

class PrescriptionDetailSerializer(serializers.ModelSerializer):
    medication_details = InventorySerializer(source='medication', read_only=True)

    class Meta:
        model = PrescriptionDetail
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    details = PrescriptionDetailSerializer(many=True, read_only=True, source='prescriptiondetail_set')
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'