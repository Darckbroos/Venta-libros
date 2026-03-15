from django.db import models
from apps.orders.models import Order


class PaymentEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payment_events')
    event_type = models.CharField(max_length=50, verbose_name='Tipo de evento')
    payment_id = models.CharField(max_length=255, verbose_name='ID de pago')
    status = models.CharField(max_length=50, verbose_name='Estado')
    raw_data = models.JSONField(default=dict, verbose_name='Datos crudos')
    processed = models.BooleanField(default=False, verbose_name='Procesado')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Evento de Pago'
        verbose_name_plural = 'Eventos de Pago'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.event_type} - {self.payment_id}"
