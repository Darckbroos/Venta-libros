
"use client";

import { useState } from 'react';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    // Simulate sending an email
    setTimeout(() => {
      setStatus(`Gracias por tu mensaje, ${name}. Te responderemos pronto.`);
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className={styles.formContainer}>
      <h3>Formulario de Contacto</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>
        <button type="submit" className={styles.button}>
          Enviar
        </button>
      </form>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
