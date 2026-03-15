import hashlib
import hmac
import json
import logging
from django.conf import settings
from django.shortcuts import get_object_or_404
import requests
from apps.orders.models import Order, OrderStatus
from .models import PaymentEvent

logger = logging.getLogger(__name__)


class MercadoPagoService:
    BASE_URL = 'https://api.mercadopago.com'
    
    def __init__(self):
        self.access_token = settings.MERCADOPAGO_ACCESS_TOKEN
        self.webhook_secret = settings.MERCADOPAGO_WEBHOOK_SECRET

    def create_preference(self, order):
        url = f'{self.BASE_URL}/checkout/preferences'
        
        items = []
        for item in order.items.all():
            items.append({
                'title': item.book_title,
                'quantity': item.quantity,
                'unit_price': float(item.book_price),
                'currency_id': 'CLP'
            })

        payer = {
            'name': order.shipping_address.full_name.split()[0],
            'surname': ' '.join(order.shipping_address.full_name.split()[1:]),
            'email': order.shipping_address.email
        }

        frontend_url = settings.FRONTEND_URL

        data = {
            'items': items,
            'payer': payer,
            'back_urls': {
                'success': f'{frontend_url}/checkout/success',
                'failure': f'{frontend_url}/checkout/failure',
                'pending': f'{frontend_url}/checkout/pending'
            },
            'external_reference': str(order.order_id),
            'notification_url': f'{settings.BACKEND_URL}/api/payments/webhook/'
        }

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }

        try:
            response = requests.post(url, json=data, headers=headers, timeout=30)
            response.raise_for_status()
            result = response.json()
            
            order.mercadopago_preference_id = result.get('id')
            order.save()
            
            return result
        except requests.RequestException as e:
            logger.error(f'Error creating Mercado Pago preference: {e}')
            raise

    def verify_webhook_signature(self, request):
        if not self.webhook_secret:
            return True
        
        signature = request.headers.get('x-signature', '')
        timestamp = request.headers.get('x-timestamp', '')
        
        if not signature or not timestamp:
            return False
        
        payload = request.body
        
        expected_signature = hmac.new(
            self.webhook_secret.encode(),
            f'{timestamp}.{payload}'.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)

    def process_webhook(self, data):
        event_type = data.get('type')
        payment_data = data.get('data', {}).get('id')
        
        if event_type == 'payment':
            return self.process_payment(payment_data)
        
        return {'status': 'ignored', 'reason': 'Not a payment event'}

    def process_payment(self, payment_id):
        url = f'{self.BASE_URL}/v1/payments/{payment_id}'
        headers = {
            'Authorization': f'Bearer {self.access_token}'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            payment = response.json()
            
            external_reference = payment.get('external_reference')
            order = get_object_or_404(Order, order_id=external_reference)
            
            PaymentEvent.objects.create(
                order=order,
                event_type='payment',
                payment_id=str(payment_id),
                status=payment.get('status'),
                raw_data=payment
            )
            
            if payment.get('status') == 'approved':
                order.status = OrderStatus.PAID
                order.mercadopago_payment_id = str(payment_id)
                order.save()
            
            return {'status': 'processed', 'order_id': str(order.order_id)}
            
        except requests.RequestException as e:
            logger.error(f'Error processing payment webhook: {e}')
            raise

    def get_payment_status(self, payment_id):
        url = f'{self.BASE_URL}/v1/payments/{payment_id}'
        headers = {
            'Authorization': f'Bearer {self.access_token}'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f'Error getting payment status: {e}')
            raise
