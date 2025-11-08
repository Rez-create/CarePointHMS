from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Appointment, Consultation
from .serializers import AppointmentSerializer, ConsultationSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Appointment.objects.all()
        status = self.request.query_params.get('status', None)
        doctor_id = self.request.query_params.get('doctor_id', None)
        patient_id = self.request.query_params.get('patient_id', None)
        date = self.request.query_params.get('date', None)

        if status:
            queryset = queryset.filter(status=status)
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if date:
            queryset = queryset.filter(appointment_datetime__date=date)

        return queryset.order_by('appointment_datetime')

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        reason = request.data.get('reason', '')
        
        if appointment.status not in ['completed', 'cancelled']:
            appointment.status = 'cancelled'
            appointment.cancellation_reason = reason
            appointment.save()
            return Response({'status': 'appointment cancelled'})
        return Response(
            {'error': 'Cannot cancel a completed or already cancelled appointment'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Consultation.objects.all()
        doctor_id = self.request.query_params.get('doctor_id', None)
        patient_id = self.request.query_params.get('patient_id', None)
        date = self.request.query_params.get('date', None)

        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if date:
            queryset = queryset.filter(consultation_datetime__date=date)

        return queryset.order_by('-consultation_datetime')
