'use client';

import { AppProvider } from '@/lib/providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </AppProvider>
  );
}
