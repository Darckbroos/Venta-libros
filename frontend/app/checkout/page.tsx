'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/providers';
import { ordersApi, paymentsApi } from '@/lib/api';
import styles from './page.module.css';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  address_details: string;
  reference_notes: string;
  order_notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, locale } = useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    address: '',
    address_details: '',
    reference_notes: '',
    order_notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-CL' : 'en-US', {
      style: 'currency',
      currency: locale === 'es' ? 'CLP' : 'USD',
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = locale === 'es' ? 'El nombre es requerido' : 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = locale === 'es' ? 'El email es requerido' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'es' ? 'Email inválido' : 'Invalid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = locale === 'es' ? 'El teléfono es requerido' : 'Phone is required';
    }
    if (!formData.region.trim()) {
      newErrors.region = locale === 'es' ? 'La región es requerida' : 'Region is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = locale === 'es' ? 'La ciudad es requerida' : 'City is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = locale === 'es' ? 'La dirección es requerida' : 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const items = cart.map((item) => ({
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
      }));

      const orderResponse = await ordersApi.create({
        items,
        shipping_address: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          city: formData.city,
          address: formData.address,
          address_details: formData.address_details,
          reference_notes: formData.reference_notes,
          order_notes: formData.order_notes,
        },
      });

      const orderId = orderResponse.data.order_id;

      const paymentResponse = await paymentsApi.createPreference(orderId);
      
      clearCart();
      
      if (paymentResponse.data.init_point) {
        window.location.href = paymentResponse.data.init_point;
      } else {
        router.push(`/checkout/success?order_id=${orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(locale === 'es' ? 'Error al procesar el pedido' : 'Error processing order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <span className={styles.emptyIcon}>🛒</span>
        <h2>{locale === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty'}</h2>
        <Link href="/" className={styles.continueButton}>
          {locale === 'es' ? 'Ver Catálogo' : 'View Catalog'}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {locale === 'es' ? 'Finalizar Compra' : 'Checkout'}
        </h1>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h2>{locale === 'es' ? 'Información de Envío' : 'Shipping Information'}</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'es' ? 'Nombre Completo' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.full_name ? styles.error : ''}`}
                />
                {errors.full_name && <span className={styles.errorText}>{errors.full_name}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {locale === 'es' ? 'Correo Electrónico' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {locale === 'es' ? 'Teléfono' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {locale === 'es' ? 'Región/Estado' : 'Region/State'} *
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.region ? styles.error : ''}`}
                  />
                  {errors.region && <span className={styles.errorText}>{errors.region}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {locale === 'es' ? 'Ciudad/Comuna' : 'City/Commune'} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.city ? styles.error : ''}`}
                  />
                  {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'es' ? 'Dirección' : 'Address'} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.address ? styles.error : ''}`}
                />
                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'es' ? 'Detalles de Dirección (opcional)' : 'Address Details (optional)'}
                </label>
                <input
                  type="text"
                  name="address_details"
                  value={formData.address_details}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'es' ? 'Notas de Referencia (opcional)' : 'Reference Notes (optional)'}
                </label>
                <textarea
                  name="reference_notes"
                  value={formData.reference_notes}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={2}
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading 
                ? (locale === 'es' ? 'Procesando...' : 'Processing...') 
                : (locale === 'es' ? 'Pagar con Mercado Pago' : 'Pay with Mercado Pago')
              }
            </button>
          </form>

          <div className={styles.summary}>
            <h2>{locale === 'es' ? 'Resumen del Pedido' : 'Order Summary'}</h2>
            
            <div className={styles.items}>
              {cart.map((item) => (
                <div key={item.book.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.book.main_image_url ? (
                      <Image
                        src={item.book.main_image_url}
                        alt={item.book.title}
                        width={60}
                        height={80}
                      />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{item.book.title}</h4>
                    <p>{locale === 'es' ? 'Cantidad' : 'Quantity'}: {item.quantity}</p>
                    <span className={styles.itemPrice}>
                      {formatPrice(parseFloat(item.book.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.total}>
              <span>{locale === 'es' ? 'Total' : 'Total'}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
