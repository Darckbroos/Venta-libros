import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>Librería Online</h3>
            <p className={styles.text}>
              Tu destino de lectura. Encuentra los mejores libros al mejor precio.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subtitle}>Enlaces</h4>
            <Link href="/" className={styles.link}>Inicio</Link>
            <Link href="/#books" className={styles.link}>Catálogo</Link>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subtitle}>Legal</h4>
            <Link href="/privacy" className={styles.link}>Política de Privacidad</Link>
            <Link href="/terms" className={styles.link}>Términos de Servicio</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Librería Online. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
