from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import Supplier, Inventory, Prescription, PrescriptionDetail
from .serializers import (
    SupplierSerializer, InventorySerializer,
    PrescriptionSerializer, PrescriptionDetailSerializer
)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Supplier.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(supplier_name__icontains=search)
        return queryset

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Inventory.objects.all()
        category = self.request.query_params.get('category', None)
        low_stock = self.request.query_params.get('low_stock', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if low_stock:
            queryset = queryset.filter(quantity_in_stock__lte=F('reorder_level'))
            
        return queryset

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        inventory = self.get_object()
        quantity = request.data.get('quantity', 0)
        
        try:
            quantity = int(quantity)
            inventory.quantity_in_stock += quantity
            if inventory.quantity_in_stock < 0:
                return Response(
                    {'error': 'Stock cannot be negative'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            inventory.save()
            return Response({
                'status': 'stock updated',
                'new_quantity': inventory.quantity_in_stock
            })
        except ValueError:
            return Response(
                {'error': 'Invalid quantity'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Prescription.objects.all()
        status = self.request.query_params.get('status', None)
        patient_id = self.request.query_params.get('patient_id', None)
        doctor_id = self.request.query_params.get('doctor_id', None)

        if status:
            queryset = queryset.filter(status=status)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)

        return queryset.order_by('-prescribed_date')

    @action(detail=True, methods=['post'])
    def dispense(self, request, pk=None):
        prescription = self.get_object()
        if prescription.status != 'pending':
            return Response(
                {'error': 'Prescription already processed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update prescription status and record who dispensed it
        prescription.status = 'dispensed'
        prescription.save()

        # Update inventory for each medication
        for detail in prescription.prescriptiondetail_set.all():
            medication = detail.medication
            if medication.quantity_in_stock < detail.quantity:
                return Response(
                    {'error': f'Insufficient stock for {medication.item_name}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            medication.quantity_in_stock -= detail.quantity
            medication.save()
            
            detail.dispensed_by = request.user
            detail.dispensed_date = timezone.now()
            detail.save()

        return Response({'status': 'prescription dispensed'})

class PrescriptionDetailViewSet(viewsets.ModelViewSet):
    queryset = PrescriptionDetail.objects.all()
    serializer_class = PrescriptionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = PrescriptionDetail.objects.all()
        prescription_id = self.request.query_params.get('prescription_id', None)
        if prescription_id:
            queryset = queryset.filter(prescription_id=prescription_id)
        return queryset
