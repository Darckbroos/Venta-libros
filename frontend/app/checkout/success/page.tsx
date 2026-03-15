'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.icon}>✅</span>
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido ha sido confirmado exitosamente.</p>
        
        {orderId && (
          <div className={styles.orderId}>
            <span>Número de pedido:</span>
            <strong>{orderId}</strong>
          </div>
        )}
        
        <p className={styles.message}>
          Te hemos enviado un correo de confirmación con los detalles de tu pedido.
          Nos pondremos en contacto contigo pronto para coordinar el envío.
        </p>
        
        <Link href="/" className={styles.button}>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

const styles = {
  container: 'min-h-[60vh] flex items-center justify-center',
  content: 'text-center max-w-md mx-auto p-8',
  icon: 'text-6xl block mb-4',
  orderId: 'bg-gray-100 p-4 rounded-lg mt-6 mb-6',
  message: 'text-gray-600 mb-8',
  button: 'inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition',
};
