import type { Metadata } from 'next';
import './styles/globals.css';
import { AppLayout } from '@/components/AppLayout';

export const metadata: Metadata = {
  title: {
    default: 'Librería Online - Tu Destino de Lectura',
    template: '%s | Librería Online',
  },
  description: 'Encuentra los mejores libros en nuestra librería online. Gran variedad de títulos, precios increíbles y entrega a domicilio.',
  keywords: ['libros', 'librería', 'comprar libros', 'lectura', 'novelas'],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'Librería Online',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
