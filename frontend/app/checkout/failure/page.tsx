'use client';

import Link from 'next/link';

export default function FailurePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <span className="text-6xl block mb-4">❌</span>
        <h1 className="text-2xl font-bold mb-4">Pago Fallido</h1>
        <p className="text-gray-600 mb-8">
          Hubo un problema al procesar tu pago. Por favor intenta de nuevo.
        </p>
        <Link href="/checkout" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Intentar de Nuevo
        </Link>
      </div>
    </div>
  );
}
