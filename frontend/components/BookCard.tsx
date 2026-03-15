import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/lib/api';
import { useApp } from '@/lib/providers';
import styles from './BookCard.module.css';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart, locale } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      main_image_url: book.main_image_url,
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(parseFloat(price));
  };

  return (
    <Link href={`/book/${book.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {book.main_image_url ? (
          <Image
            src={book.main_image_url}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>📚</span>
          </div>
        )}
        {book.is_featured && (
          <span className={styles.badge}>✨ Destacado</span>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>por {book.author}</p>
        <p className={styles.description}>{book.short_description.substring(0, 80)}...</p>
        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>{formatPrice(book.price)}</span>
            <span className={book.stock > 0 ? styles.stock : styles.outOfStock}>
              {book.stock > 0 ? `(${book.stock} disponibles)` : 'Agotado'}
            </span>
          </div>
          <button 
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={book.stock === 0}
          >
            {book.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </Link>
  );
}
