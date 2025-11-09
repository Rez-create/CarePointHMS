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

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def doctor_requests(self, request):
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
        
        lab_requests = LabRequest.objects.filter(doctor=doctor).order_by('-request_date')
        
        request_data = []
        for req in lab_requests:
            # Check if result exists
            result_available = hasattr(req, 'labresult')
            
            request_data.append({
                'id': f'LAB-REQ-{req.id:03d}',
                'patientName': f'{req.patient.first_name} {req.patient.last_name}',
                'testName': req.test_name,
                'requestDate': req.request_date.date(),
                'status': req.status,
                'reason': req.appointment.reason_for_visit if req.appointment else 'General request',
                'resultAvailable': result_available
            })
        
        return Response({'results': request_data})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def create_request(self, request):
        from userauth.models import Staff
        from patients.models import Patient
        
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
            
            # Create lab request
            lab_request = LabRequest.objects.create(
                patient=patient,
                doctor=doctor,
                test_name=request.data.get('test_name'),
                priority=request.data.get('priority', 'routine'),
                status='requested'
            )
            
            return Response({
                'message': 'Lab request created successfully',
                'request_id': lab_request.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
