from rest_framework import serializers
from .models import Staff, StaffSchedule

class StaffScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffSchedule
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    schedules = StaffScheduleSerializer(many=True, read_only=True, source='staffschedule_set')
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Staff
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 
                 'role', 'specialization', 'phone', 'status', 'schedules')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Staff(**validated_data)
        user.set_password(password)
        user.save()
        return user