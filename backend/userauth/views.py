from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Staff, StaffSchedule
from .serializers import StaffSerializer, StaffScheduleSerializer
from patients.models import Patient
from patients.serializers import PatientSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Staff.objects.all()
        role = self.request.query_params.get('role', None)
        if role is not None:
            queryset = queryset.filter(role=role)
        return queryset

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = Staff.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'staff',
                    'user': StaffSerializer(user).data,
                })
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Staff.DoesNotExist:
            return Response(
                {'error': 'No account found with this email'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class StaffScheduleViewSet(viewsets.ModelViewSet):
    queryset = StaffSchedule.objects.all()
    serializer_class = StaffScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = StaffSchedule.objects.all()
        staff_id = self.request.query_params.get('staff_id', None)
        if staff_id is not None:
            queryset = queryset.filter(staff_id=staff_id)
        return queryset
