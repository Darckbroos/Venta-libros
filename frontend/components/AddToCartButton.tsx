'use client';

import { useApp } from '@/lib/providers';
import { Book } from '@/lib/api';
import styles from './AddToCartButton.module.css';

interface Props {
  book: Book;
}

export function AddToCartButton({ book }: Props) {
  const { addToCart, locale } = useApp();

  const handleClick = () => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      main_image_url: book.main_image_url,
    });
  };

  const isOutOfStock = book.stock === 0;

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      disabled={isOutOfStock}
    >
      {isOutOfStock 
        ? (locale === 'es' ? 'Agotado' : 'Out of Stock') 
        : (locale === 'es' ? 'Agregar al Carrito' : 'Add to Cart')
      }
    </button>
  );
}
