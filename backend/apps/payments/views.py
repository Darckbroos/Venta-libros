from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.orders.models import Order
from .services import MercadoPagoService


class CreatePaymentPreferenceView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response(
                {'error': 'order_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order = get_object_or_404(Order, order_id=order_id)
        
        if order.status != 'pending':
            return Response(
                {'error': 'Order is not in pending status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            mp_service = MercadoPagoService()
            preference = mp_service.create_preference(order)
            
            return Response({
                'preference_id': preference.get('id'),
                'init_point': preference.get('init_point'),
                'sandbox_init_point': preference.get('sandbox_init_point')
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WebhookView(APIView):
    def post(self, request):
        if not request.body:
            return Response(
                {'error': 'No body provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        mp_service = MercadoPagoService()
        
        if not mp_service.verify_webhook_signature(request):
            return Response(
                {'error': 'Invalid signature'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            data = request.data
            result = mp_service.process_webhook(data)
            return Response(result)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
