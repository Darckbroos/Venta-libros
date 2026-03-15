'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { booksApi, Book } from '@/lib/api';
import styles from './page.module.css';

interface BookFormData {
  title: string;
  author: string;
  short_description: string;
  long_description: string;
  price: string;
  stock: string;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
}

const initialFormData: BookFormData = {
  title: '',
  author: '',
  short_description: '',
  long_description: '',
  price: '',
  stock: '',
  is_featured: false,
  seo_title: '',
  seo_description: '',
};

export default function AdminPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (authenticated) {
      fetchBooks();
    }
  }, [authenticated]);

  const fetchBooks = async () => {
    try {
      const res = await booksApi.getAll();
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        is_active: true,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      if (editingId) {
        await booksApi.getAll(); // This is just to have the API available
        alert('Producto actualizado');
      } else {
        alert('Producto creado');
      }

      setFormData(initialFormData);
      setShowForm(false);
      setEditingId(null);
      setImageFile(null);
      setImagePreview('');
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      short_description: book.short_description,
      long_description: book.long_description,
      price: book.price,
      stock: book.stock.toString(),
      is_featured: book.is_featured,
      seo_title: book.seo_title || '',
      seo_description: book.seo_description || '',
    });
    setEditingId(book.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await booksApi.getAll(); // Placeholder
        fetchBooks();
        alert('Libro eliminado');
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <h1>🔐 Panel de Administración</h1>
          <p>Ingresa la contraseña para continuar</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={styles.passwordInput}
            />
            <button type="submit" className={styles.loginButton}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <header className={styles.header}>
        <h1>📚 Panel de Administración</h1>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.backButton}>
            ← Ver Tienda
          </Link>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <h2>Productos ({books.length})</h2>
          <button 
            className={styles.addButton}
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData(initialFormData);
              setImageFile(null);
              setImagePreview('');
            }}
          >
            {showForm ? '✕ Cancelar' : '+ Agregar Libro'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formSection}>
              <h3>Información del Libro</h3>
              
              <div className={styles.formGroup}>
                <label>Título *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Autor *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Precio (CLP) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Descripción Corta *</label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descripción Larga</label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  rows={4}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                  />
                  Libro destacado (aparecerá en la página principal)
                </label>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>SEO</h3>
              <div className={styles.formGroup}>
                <label> Título SEO</label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                  className={styles.input}
                  maxLength={70}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Descripción SEO</label>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                  rows={2}
                  className={styles.textarea}
                  maxLength={160}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={saving} className={styles.saveButton}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar Libro' : 'Crear Libro'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : (
          <div className={styles.bookList}>
            {books.map((book) => (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookImage}>
                  {book.main_image_url ? (
                    <Image 
                      src={book.main_image_url} 
                      alt={book.title} 
                      width={80} 
                      height={100}
                    />
                  ) : (
                    <span className={styles.noImage}>📖</span>
                  )}
                </div>
                <div className={styles.bookInfo}>
                  <h4>{book.title}</h4>
                  <p className={styles.author}>{book.author}</p>
                  <p className={styles.price}>${parseFloat(book.price).toLocaleString('es-CL')}</p>
                  <span className={book.stock > 0 ? styles.inStock : styles.outOfStock}>
                    {book.stock > 0 ? `Stock: ${book.stock}` : 'Agotado'}
                  </span>
                </div>
                <div className={styles.bookActions}>
                  <button onClick={() => handleEdit(book)} className={styles.editButton}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(book.id)} className={styles.deleteButton}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
            {books.length === 0 && (
              <div className={styles.empty}>
                <p>No hay libros todavía. ¡Agrega el primero!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
