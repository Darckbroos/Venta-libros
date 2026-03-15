from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress, OrderStatus


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = [
            'id', 'full_name', 'email', 'phone', 'region', 'city',
            'address', 'address_details', 'reference_notes', 'order_notes'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'book_title', 'book_price', 'quantity', 'subtotal']


class OrderCreateSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    shipping_address = ShippingAddressSerializer()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_id', 'status', 'shipping_address', 'total_amount',
            'mercadopago_preference_id', 'created_at', 'updated_at', 'items'
        ]


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
