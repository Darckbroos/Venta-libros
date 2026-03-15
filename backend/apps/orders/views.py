from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import Order, OrderItem, ShippingAddress, OrderStatus
from .serializers import OrderSerializer, OrderCreateSerializer, OrderUpdateSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    lookup_field = 'order_id'

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items_data = serializer.validated_data['items']
        shipping_data = serializer.validated_data['shipping_address']

        shipping_address = ShippingAddress.objects.create(**shipping_data)

        total_amount = 0
        for item in items_data:
            total_amount += float(item['price']) * int(item['quantity'])

        order = Order.objects.create(
            shipping_address=shipping_address,
            total_amount=total_amount
        )

        for item in items_data:
            OrderItem.objects.create(
                order=order,
                book_title=item['title'],
                book_price=item['price'],
                quantity=int(item['quantity'])
            )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def update_status(self, request, order_id=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in OrderStatus.values:
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)


class OrderStatusView(APIView):
    def get(self, request, order_id):
        order = get_object_or_404(Order, order_id=order_id)
        return Response(OrderSerializer(order).data)
