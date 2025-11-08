from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import StaffViewSet, StaffScheduleViewSet

router = DefaultRouter()
router.register('staff', StaffViewSet)
router.register('schedules', StaffScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]