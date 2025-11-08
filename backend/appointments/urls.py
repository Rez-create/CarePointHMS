from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AppointmentViewSet, ConsultationViewSet

router = DefaultRouter()
router.register('appointments', AppointmentViewSet)
router.register('consultations', ConsultationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]