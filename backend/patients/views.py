from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import date
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
        
        from appointments.models import Appointment
        
        # Get medical records
        records = MedicalRecord.objects.filter(patient=patient).order_by('-record_date')
        
        # Get appointments
        appointments = Appointment.objects.filter(patient=patient).order_by('-appointment_datetime')
        
        combined_records = []
        
        # Add medical records
        for record in records:
            combined_records.append({
                'id': f'record_{record.id}',
                'date': record.record_date.date(),
                'doctorName': record.recorded_by.get_full_name() if record.recorded_by else 'Unknown Doctor',
                'specialty': record.recorded_by.specialization if record.recorded_by else 'General',
                'diagnosis': record.description,
                'notes': record.notes or 'No additional notes',
                'type': 'medical_record',
                'attachments': 0
            })
        
        # Add appointments as records
        for appointment in appointments:
            combined_records.append({
                'id': f'appointment_{appointment.id}',
                'date': appointment.appointment_datetime.date(),
                'doctorName': appointment.doctor.get_full_name() if appointment.doctor else 'Unknown Doctor',
                'specialty': appointment.doctor.specialization if appointment.doctor else 'General',
                'diagnosis': f'Appointment - {appointment.status.title()}',
                'notes': appointment.reason_for_visit or 'No reason specified',
                'type': 'appointment',
                'attachments': 0
            })
        
        # Sort by date (newest first)
        combined_records.sort(key=lambda x: x['date'], reverse=True)
        
        return Response({'results': combined_records})

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

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def my_billing(self, request):
        patient = self.get_patient_from_token(request)
        if not patient:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        from billing.models import Bill, BillDetail
        
        bills = Bill.objects.filter(patient=patient).order_by('-issued_date')
        
        billing_data = []
        for bill in bills:
            details = BillDetail.objects.filter(bill=bill)
            items = []
            for detail in details:
                if detail.service:
                    items.append(detail.service.service_name)
                elif detail.item:
                    items.append(detail.item.name)
            
            billing_data.append({
                'id': f'INV-{bill.id:03d}',
                'date': bill.issued_date.date(),
                'amount': float(bill.total_amount),
                'items': items or ['Consultation'],
                'status': bill.status,
                'dueDate': bill.due_date
            })
        
        return Response({'results': billing_data})

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def doctor_appointments(self, request):
        from appointments.models import Appointment
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
        
        # Get all appointments for the doctor
        appointments = Appointment.objects.filter(
            doctor=doctor
        ).order_by('appointment_datetime')
        
        appointment_data = []
        for apt in appointments:
            appointment_data.append({
                'id': str(apt.id),
                'patientName': f'{apt.patient.first_name} {apt.patient.last_name}',
                'patientId': f'P{apt.patient.id:03d}',
                'time': apt.appointment_datetime.strftime('%I:%M %p'),
                'status': apt.status,
                'reason': apt.reason_for_visit or 'General consultation',
                'phone': apt.patient.contact_phone or 'N/A'
            })
        
        return Response({'results': appointment_data})

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def doctor_patients(self, request):
        from appointments.models import Appointment
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
        
        # Get unique patients who have appointments with this doctor
        appointments = Appointment.objects.filter(doctor=doctor).select_related('patient')
        unique_patients = {}
        
        for apt in appointments:
            patient = apt.patient
            if patient.id not in unique_patients:
                # Get latest appointment for last visit
                latest_apt = Appointment.objects.filter(
                    doctor=doctor, 
                    patient=patient
                ).order_by('-appointment_datetime').first()
                
                unique_patients[patient.id] = {
                    'id': f'P{patient.id:03d}',
                    'name': f'{patient.first_name} {patient.last_name}',
                    'age': patient.age if hasattr(patient, 'age') else 'N/A',
                    'gender': patient.gender,
                    'phone': patient.contact_phone or 'N/A',
                    'email': patient.contact_email,
                    'lastVisit': latest_apt.appointment_datetime.date() if latest_apt else 'N/A',
                    'conditions': ['General Care']  # Default condition
                }
        
        return Response({'results': list(unique_patients.values())})



    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def update_appointment_status(self, request):
        from appointments.models import Appointment
        
        appointment_id = request.data.get('appointment_id')
        new_status = request.data.get('status')
        
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            appointment.status = new_status
            appointment.save()
            
            return Response({'message': 'Appointment status updated successfully'})
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

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
                status='pending'
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
