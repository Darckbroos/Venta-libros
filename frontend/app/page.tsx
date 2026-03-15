"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Book } from '@/lib/api';
import { BookCard } from '@/components/BookCard';
import { ContactForm } from '@/components/ContactForm';
import styles from './page.module.css';

async function getBooks(): Promise<Book[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(`${baseUrl}/api/books/all/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  const featuredBooks = books.filter(b => b.is_featured);
  const regularBooks = books.filter(b => !b.is_featured);

  const toggleContactForm = () => {
    setShowContactForm(!showContactForm);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Especializada en Autoayuda y Psicología</span>
          <h1 className={styles.heroTitle}>Transforma Tu Vida a Través de la Lectura</h1>
          <p className={styles.heroSubtitle}>
            Descubre libros que te ayudarán a crecer personalmente, 
            entender tus emociones y alcanzar tu máximo potencial.
          </p>
          <div className={styles.heroButtons}>
            <a href="#books" className={styles.heroButton}>
              Ver Catálogo
            </a>
            <a href="#about" className={styles.heroButtonSecondary}>
              Conócenos
            </a>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Libros Vendidos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Títulos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9</span>
              <span className={styles.statLabel}>Valoración</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.heroImagePlaceholder}>🌟</div>
        </div>
      </section>

      {featuredBooks.length > 0 && (
        <section className={styles.featuredSection} id="books">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>✨ Selección Especial</span>
              <h2 className={styles.sectionTitle}>Libros Destacados</h2>
              <p className={styles.sectionSubtitle}>
                Los libros más populares y recomendados por nuestros lectores
              </p>
            </div>
            <div className={styles.featuredGrid}>
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {regularBooks.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>📚 Catálogo</span>
              <h2 className={styles.sectionTitle}>Nuestra Colección</h2>
              <p className={styles.sectionSubtitle}>
                Explora todos nuestros títulos de desarrollo personal y psicología
              </p>
            </div>
            <div className={styles.grid}>
              {regularBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {books.length === 0 && (
        <section className={styles.empty}>
          <div className={styles.emptyContent}>
            <span className={styles.emptyIcon}>📖</span>
            <h2>Próximamente</h2>
            <p>Estamos preparando nuestro catálogo. Vuelve pronto.</p>
          </div>
        </section>
      )}

      <section className={styles.about} id="about">
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <span className={styles.sectionLabel}>💜 Sobre Nosotros</span>
              <h2>Comprometidos con Tu Bienestar Emotional</h2>
              <p>
                Somos una librería especializada en libros de psicología, 
                autoayuda y desarrollo personal. Nuestra misión es 
                ayudarte a encontrar las herramientas que necesitas para 
                tu crecimiento emocional y mental.
              </p>
              <div className={styles.aboutFeatures}>
                <div className={styles.aboutFeature}>
                  <span>✅</span>
                  <span>Selección cuidada de títulos</span>
                </div>
                <div className={styles.aboutFeature}>
                  <span>✅</span>
                  <span>Asesoría personalizada</span>
                </div>
                <div className={styles.aboutFeature}>
                  <span>✅</span>
                  <span>Envíos discretos y seguros</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutImage}>
              <div className={styles.aboutImagePlaceholder}>🧠</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🚚</span>
              <h3>Envío Rápido</h3>
              <p>Entregamos a todo el país en 3-5 días hábiles</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📦</span>
              <h3>Empaque Discreto</h3>
              <p>Tu privacidad es importante - empaque sin marcas</p>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💳</span>
              <h3>Pago Seguro</h3>
              <p>Tu información protegida con Mercado Pago</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>¿Necesitas Ayuda para Elegir?</h2>
          <p>Contáctanos y te orientamos en tu búsqueda</p>
          <button onClick={toggleContactForm} className={styles.ctaButton}>
            Escríbenos
          </button>
          {showContactForm && <ContactForm />}
        </div>
      </section>
    </div>
  );
}
