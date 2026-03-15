from django.contrib import admin
from .models import Order, OrderItem, ShippingAddress, OrderStatus


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ['book_title', 'book_price', 'quantity', 'subtotal']
    extra = 0


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'city', 'region', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'city']
    list_filter = ['region', 'created_at']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'status', 'full_name', 'email', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'shipping_address__full_name', 'shipping_address__email']
    readonly_fields = ['order_id', 'total_amount', 'mercadopago_preference_id', 
                       'mercadopago_payment_id', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    list_editable = ['status']

    def full_name(self, obj):
        return obj.shipping_address.full_name
    full_name.short_name = 'Cliente'

    def email(self, obj):
        return obj.shipping_address.email
    email.short_name = 'Email'

    fieldsets = (
        ('Información del Pedido', {
            'fields': ('order_id', 'status', 'total_amount')
        }),
        ('Dirección de Envío', {
            'fields': ('shipping_address',)
        }),
        ('Información de Pago', {
            'fields': ('mercadopago_preference_id', 'mercadopago_payment_id')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
