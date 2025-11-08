from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    SupplierViewSet, InventoryViewSet,
    PrescriptionViewSet, PrescriptionDetailViewSet
)

router = DefaultRouter()
router.register('suppliers', SupplierViewSet)
router.register('inventory', InventoryViewSet)
router.register('prescriptions', PrescriptionViewSet)
router.register('prescription-details', PrescriptionDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]