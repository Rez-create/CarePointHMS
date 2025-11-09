from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Patient, MedicalRecord
from .serializers import PatientSerializer, MedicalRecordSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Patient.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                first_name__icontains=search) | queryset.filter(
                last_name__icontains=search) | queryset.filter(
                contact_email__icontains=search) | queryset.filter(
                contact_phone__icontains=search
            )
        return queryset

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            patient = Patient.objects.get(contact_email=email)
            if patient.check_password(password):
                # Generate token manually for patient
                refresh = RefreshToken()
                refresh['user_id'] = patient.id
                refresh['user_type'] = 'patient'
                
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'patient',
                    'user': PatientSerializer(patient).data,
                })
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Patient.DoesNotExist:
            return Response(
                {'error': 'No patient account found with this email'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            patient = serializer.save()
            return Response({
                'message': 'Patient registered successfully',
                'patient': PatientSerializer(patient).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_patient_from_token(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        try:
            import jwt
            from django.conf import settings
            
            token = auth_header.split(' ')[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            patient_id = decoded_token.get('user_id')
            
            if patient_id:
                return Patient.objects.get(id=patient_id)
        except:
            pass
        return None

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def me(self, request):
        patient = self.get_patient_from_token(request)
        if not patient:
            # Return test data if no patient found
            return Response({
                'first_name': 'John',
                'last_name': 'Doe', 
                'contact_email': 'john.doe@email.com',
                'contact_phone': '+254 712 345 678',
                'date_of_birth': '1990-05-15',
                'gender': 'M',
                'address': '123 Main Street, Nairobi, Kenya'
            })
        return Response(PatientSerializer(patient).data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def my_appointments(self, request):
        patient = self.get_patient_from_token(request)
        if not patient:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        from appointments.models import Appointment
        appointments = Appointment.objects.filter(patient=patient).order_by('appointment_datetime')
        
        appointment_data = []
        for apt in appointments:
            appointment_data.append({
                'id': apt.id,
                'doctorName': apt.doctor.get_full_name() if apt.doctor else 'Unknown Doctor',
                'specialty': apt.doctor.specialization if apt.doctor else 'General',
                'date': apt.appointment_datetime.date(),
                'time': apt.appointment_datetime.time(),
                'status': apt.status,
                'location': 'Room 101',  # Default location
                'type': 'Consultation'
            })
        
        return Response({'results': appointment_data})

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def my_records(self, request):
        patient = self.get_patient_from_token(request)
        if not patient:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        records = MedicalRecord.objects.filter(patient=patient).order_by('-record_date')
        return Response(MedicalRecordSerializer(records, many=True).data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def my_prescriptions(self, request):
        patient = self.get_patient_from_token(request)
        if not patient:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get prescriptions from medical records
        prescriptions = MedicalRecord.objects.filter(
            patient=patient, 
            record_type='prescription'
        ).order_by('-record_date')
        
        prescription_data = []
        for record in prescriptions:
            prescription_data.append({
                'id': record.id,
                'medication': record.description.split(' - ')[0] if ' - ' in record.description else record.description,
                'dosage': record.description.split(' - ')[1] if ' - ' in record.description else 'As prescribed',
                'doctor': record.recorded_by.get_full_name() if record.recorded_by else 'Unknown Doctor',
                'date': record.record_date.date()
            })
        
        return Response({'results': prescription_data})

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def doctors(self, request):
        from userauth.models import Staff
        
        doctors = Staff.objects.filter(role='doctor', status='active')
        doctor_data = []
        
        for doctor in doctors:
            doctor_data.append({
                'id': doctor.id,
                'name': doctor.get_full_name(),
                'specialization': doctor.specialization or 'General Medicine'
            })
        
        return Response({'results': doctor_data})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def book_appointment(self, request):
        patient = self.get_patient_from_token(request)
        if not patient:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        from appointments.models import Appointment
        from userauth.models import Staff
        from datetime import datetime
        
        try:
            # Get doctor by name (you might want to improve this)
            doctor_name = request.data.get('doctor')
            doctor = Staff.objects.filter(role='doctor').first()  # Default to first doctor
            
            # Combine date and time
            appointment_date = request.data.get('appointmentDate')
            appointment_time = request.data.get('appointmentTime')
            appointment_datetime = datetime.strptime(f"{appointment_date} {appointment_time}", "%Y-%m-%d %H:%M")
            
            appointment = Appointment.objects.create(
                patient=patient,
                doctor=doctor,
                appointment_type='consultation',
                appointment_datetime=appointment_datetime,
                reason_for_visit=request.data.get('reasonForVisit', ''),
                status='booked'
            )
            
            return Response({
                'message': 'Appointment booked successfully',
                'appointment_id': appointment.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True)
    def medical_records(self, request, pk=None):
        patient = self.get_object()
        records = MedicalRecord.objects.filter(patient=patient)
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MedicalRecord.objects.all()
        patient_id = self.request.query_params.get('patient_id', None)
        record_type = self.request.query_params.get('record_type', None)
        
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if record_type:
            queryset = queryset.filter(record_type=record_type)
            
        return queryset.order_by('-record_date')
