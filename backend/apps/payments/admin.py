from django.contrib import admin
from .models import PaymentEvent


@admin.register(PaymentEvent)
class PaymentEventAdmin(admin.ModelAdmin):
    list_display = ['order', 'event_type', 'payment_id', 'status', 'processed', 'created_at']
    list_filter = ['event_type', 'status', 'processed', 'created_at']
    search_fields = ['order__order_id', 'payment_id']
    readonly_fields = ['order', 'event_type', 'payment_id', 'status', 'raw_data', 'created_at']
