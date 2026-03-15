from django.urls import path
from .views import CreatePaymentPreferenceView, WebhookView

urlpatterns = [
    path('create-preference/', CreatePaymentPreferenceView.as_view(), name='create-preference'),
    path('webhook/', WebhookView.as_view(), name='webhook'),
]
