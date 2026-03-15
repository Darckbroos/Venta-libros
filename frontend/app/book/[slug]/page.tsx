import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { booksApi, Book } from '@/lib/api';
import { AddToCartButton } from '@/components/AddToCartButton';
import styles from './page.module.css';

interface Props {
  params: { slug: string };
}

async function getBook(slug: string): Promise<Book | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const res = await fetch(`${baseUrl}/api/books/${slug}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBook(params.slug);
  
  if (!book) {
    return { title: 'Libro no encontrado' };
  }

  return {
    title: book.seo_title || book.title,
    description: book.seo_description || book.short_description,
  };
}

export default async function BookPage({ params }: Props) {
  const book = await getBook(params.slug);

  if (!book) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {book.main_image_url ? (
                <Image
                  src={book.main_image_url}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.placeholder}>📖</div>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.author}>{book.author}</p>
            
            <div className={styles.price}>
              ${parseFloat(book.price).toLocaleString('es-CL')}
            </div>

            <div className={styles.stock}>
              {book.stock > 0 ? (
                <span className={styles.inStock}>✓ En Stock</span>
              ) : (
                <span className={styles.outOfStock}>✗ Agotado</span>
              )}
            </div>

            <AddToCartButton book={book} />

            <div className={styles.description}>
              <h2>Descripción</h2>
              <p>{book.short_description}</p>
              {book.long_description && (
                <div className={styles.longDescription}>
                  {book.long_description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.features}>
              <h2>Características</h2>
              <ul>
                <li>Formato: Libro físico</li>
                <li>Idioma: Español</li>
                <li>Páginas: Contenido completo</li>
                <li>Envío: A todo el país</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
