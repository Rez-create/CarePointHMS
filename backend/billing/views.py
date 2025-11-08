from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import ServicePrice, Bill, BillDetail, Payment
from .serializers import (
    ServicePriceSerializer, BillSerializer,
    BillDetailSerializer, PaymentSerializer
)

class ServicePriceViewSet(viewsets.ModelViewSet):
    queryset = ServicePrice.objects.all()
    serializer_class = ServicePriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = ServicePrice.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(service_name__icontains=search)
        return queryset

class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Bill.objects.all()
        status = self.request.query_params.get('status', None)
        patient_id = self.request.query_params.get('patient_id', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)

        if status:
            queryset = queryset.filter(status=status)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if date_from:
            queryset = queryset.filter(issued_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(issued_date__lte=date_to)

        return queryset.order_by('-issued_date')

    @action(detail=True)
    def payments(self, request, pk=None):
        bill = self.get_object()
        payments = Payment.objects.filter(bill=bill)
        total_paid = payments.aggregate(total=Sum('amount_paid'))['total'] or 0
        remaining = bill.total_amount - total_paid
        
        return Response({
            'total_amount': bill.total_amount,
            'total_paid': total_paid,
            'remaining': remaining,
            'payments': PaymentSerializer(payments, many=True).data
        })

class BillDetailViewSet(viewsets.ModelViewSet):
    queryset = BillDetail.objects.all()
    serializer_class = BillDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = BillDetail.objects.all()
        bill_id = self.request.query_params.get('bill_id', None)
        if bill_id:
            queryset = queryset.filter(bill_id=bill_id)
        return queryset

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.all()
        bill_id = self.request.query_params.get('bill_id', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)

        if bill_id:
            queryset = queryset.filter(bill_id=bill_id)
        if date_from:
            queryset = queryset.filter(payment_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(payment_date__lte=date_to)

        return queryset.order_by('-payment_date')

    def perform_create(self, serializer):
        payment = serializer.save(received_by=self.request.user)
        bill = payment.bill
        
        # Update bill status based on payments
        total_paid = Payment.objects.filter(bill=bill).aggregate(
            total=Sum('amount_paid'))['total'] or 0
        
        if total_paid >= bill.total_amount:
            bill.status = 'paid'
        elif total_paid > 0:
            bill.status = 'partially_paid'
        bill.save()
