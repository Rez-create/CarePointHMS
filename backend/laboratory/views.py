from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import LabRequest, LabResult
from .serializers import LabRequestSerializer, LabResultSerializer

class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LabRequest.objects.all()
        status = self.request.query_params.get('status', None)
        patient_id = self.request.query_params.get('patient_id', None)
        doctor_id = self.request.query_params.get('doctor_id', None)

        if status:
            queryset = queryset.filter(status=status)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)

        return queryset.order_by('-request_date')

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        lab_request = self.get_object()
        new_status = request.data.get('status')
        if new_status in [s[0] for s in LabRequest.STATUS_CHOICES]:
            lab_request.status = new_status
            lab_request.save()
            return Response({'status': 'status updated'})
        return Response(
            {'error': 'Invalid status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LabResult.objects.all()
        request_id = self.request.query_params.get('request_id', None)
        patient_id = self.request.query_params.get('patient_id', None)
        is_abnormal = self.request.query_params.get('is_abnormal', None)

        if request_id:
            queryset = queryset.filter(request_id=request_id)
        if patient_id:
            queryset = queryset.filter(request__patient_id=patient_id)
        if is_abnormal is not None:
            queryset = queryset.filter(is_abnormal=is_abnormal)

        return queryset.order_by('-result_date')

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        lab_result = self.get_object()
        if not lab_result.verified_by:
            lab_result.verified_by = request.user
            lab_result.save()
            return Response({'status': 'result verified'})
        return Response(
            {'error': 'Result already verified'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
