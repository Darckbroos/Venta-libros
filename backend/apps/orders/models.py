from django.db import models
import uuid


class OrderStatus(models.TextChoices):
    PENDING = 'pending', 'Pendiente'
    PAID = 'paid', 'Pagado'
    PREPARING = 'preparing', 'Preparando'
    SHIPPED = 'shipped', 'Enviado'
    DELIVERED = 'delivered', 'Entregado'
    CANCELLED = 'cancelled', 'Cancelado'


class ShippingAddress(models.Model):
    full_name = models.CharField(max_length=255, verbose_name='Nombre completo')
    email = models.EmailField(verbose_name='Email')
    phone = models.CharField(max_length=20, verbose_name='Teléfono')
    region = models.CharField(max_length=100, verbose_name='Región/Estado')
    city = models.CharField(max_length=100, verbose_name='Ciudad/Comuna')
    address = models.CharField(max_length=255, verbose_name='Dirección')
    address_details = models.CharField(max_length=255, blank=True, verbose_name='Detalles de dirección')
    reference_notes = models.TextField(blank=True, verbose_name='Notas de referencia')
    order_notes = models.TextField(blank=True, verbose_name='Notas del pedido')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Dirección de envío'
        verbose_name_plural = 'Direcciones de envío'

    def __str__(self):
        return f"{self.full_name} - {self.city}"


class Order(models.Model):
    order_id = models.CharField(max_length=50, unique=True, default=uuid.uuid4, verbose_name='ID de pedido')
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        verbose_name='Estado'
    )
    shipping_address = models.ForeignKey(
        ShippingAddress,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Dirección de envío'
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Monto total')
    mercadopago_preference_id = models.CharField(max_length=255, blank=True, verbose_name='ID de preferencia MP')
    mercadopago_payment_id = models.CharField(max_length=255, blank=True, verbose_name='ID de pago MP')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Pedido {self.order_id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name='Pedido')
    book_title = models.CharField(max_length=255, verbose_name='Título del libro')
    book_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Precio')
    quantity = models.PositiveIntegerField(default=1, verbose_name='Cantidad')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Subtotal')

    class Meta:
        verbose_name = 'Item del pedido'
        verbose_name_plural = 'Items del pedido'

    def __str__(self):
        return f"{self.book_title} x {self.quantity}"

    def save(self, *args, **kwargs):
        self.subtotal = self.book_price * self.quantity
        super().save(*args, **kwargs)
