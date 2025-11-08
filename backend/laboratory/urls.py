from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import LabRequestViewSet, LabResultViewSet

router = DefaultRouter()
router.register('requests', LabRequestViewSet)
router.register('results', LabResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
]