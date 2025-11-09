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

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def doctor_consultations(self, request):
        from userauth.models import Staff
        
        # Get doctor from token or use first doctor for testing
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                import jwt
                from django.conf import settings
                
                token = auth_header.split(' ')[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token.get('user_id')
                doctor = Staff.objects.get(id=user_id, role='doctor')
            else:
                doctor = Staff.objects.filter(role='doctor').first()
        except:
            doctor = Staff.objects.filter(role='doctor').first()
        
        if not doctor:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
        
        consultations = Consultation.objects.filter(doctor=doctor).order_by('-consultation_datetime')
        
        consultation_data = []
        for cons in consultations:
            consultation_data.append({
                'id': f'CONS-{cons.id:03d}',
                'patientName': f'{cons.patient.first_name} {cons.patient.last_name}',
                'date': cons.consultation_datetime.date(),
                'time': cons.consultation_datetime.strftime('%I:%M %p'),
                'type': 'in-person',
                'status': 'completed' if cons.diagnosis else 'scheduled',
                'notes': cons.chief_complaint or 'No notes',
                'prescription': cons.diagnosis if cons.diagnosis else None
            })
        
        return Response({'results': consultation_data})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def create_consultation(self, request):
        from userauth.models import Staff
        from patients.models import Patient
        from datetime import datetime
        
        try:
            # Get doctor
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                import jwt
                from django.conf import settings
                
                token = auth_header.split(' ')[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token.get('user_id')
                doctor = Staff.objects.get(id=user_id, role='doctor')
            else:
                doctor = Staff.objects.filter(role='doctor').first()
            
            # Get patient
            patient_id = request.data.get('patient_id')
            patient = Patient.objects.get(id=patient_id)
            
            # Create appointment first
            consultation_date = request.data.get('date')
            consultation_time = request.data.get('time')
            consultation_datetime = datetime.strptime(f"{consultation_date} {consultation_time}", "%Y-%m-%d %H:%M")
            
            appointment = Appointment.objects.create(
                patient=patient,
                doctor=doctor,
                appointment_type='consultation',
                appointment_datetime=consultation_datetime,
                reason_for_visit=request.data.get('notes', ''),
                status='pending'
            )
            
            # Create consultation
            consultation = Consultation.objects.create(
                appointment=appointment,
                patient=patient,
                doctor=doctor,
                chief_complaint=request.data.get('notes', ''),
                diagnosis='',
                notes='',
                consultation_datetime=consultation_datetime
            )
            
            return Response({
                'message': 'Consultation scheduled successfully',
                'consultation_id': consultation.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def complete_consultation(self, request):
        try:
            consultation_id = request.data.get('consultation_id')
            consultation = Consultation.objects.get(id=consultation_id.replace('CONS-', ''))
            
            # Update consultation details
            consultation.notes = request.data.get('notes', '')
            consultation.diagnosis = request.data.get('diagnosis', '')
            consultation.save()
            
            return Response({
                'message': 'Consultation completed successfully'
            }, status=status.HTTP_200_OK)
            
        except Consultation.DoesNotExist:
            return Response({'error': 'Consultation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
