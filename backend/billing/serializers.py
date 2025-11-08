from rest_framework import serializers
from .models import ServicePrice, Bill, BillDetail, Payment

class ServicePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePrice
        fields = '__all__'

class BillDetailSerializer(serializers.ModelSerializer):
    service_details = ServicePriceSerializer(source='service', read_only=True)

    class Meta:
        model = BillDetail
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    received_by_name = serializers.CharField(source='received_by.get_full_name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'

class BillSerializer(serializers.ModelSerializer):
    details = BillDetailSerializer(many=True, read_only=True, source='billdetail_set')
    payments = PaymentSerializer(many=True, read_only=True, source='payment_set')
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    remaining_amount = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = '__all__'

    def get_remaining_amount(self, obj):
        total_paid = sum(payment.amount_paid for payment in obj.payment_set.all())
        return obj.total_amount - total_paid