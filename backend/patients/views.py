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
