'use client';

import Link from 'next/link';
import { useApp } from '@/lib/providers';
import styles from './Header.module.css';

export function Header() {
  const { locale, setLocale, cart, t } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>📚</span>
          <span>Librería Online</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            {locale === 'es' ? 'Inicio' : 'Home'}
          </Link>
          <Link href="/#books" className={styles.navLink}>
            {locale === 'es' ? 'Catálogo' : 'Catalog'}
          </Link>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.langSwitch}
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          <Link href="/checkout" className={styles.cart}>
            <span className={styles.cartIcon}>🛒</span>
            {cart.length > 0 && (
              <span className={styles.cartBadge}>{cart.length}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
