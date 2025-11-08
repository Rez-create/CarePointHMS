from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    ServicePriceViewSet, BillViewSet,
    BillDetailViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register('services', ServicePriceViewSet)
router.register('bills', BillViewSet)
router.register('bill-details', BillDetailViewSet)
router.register('payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]