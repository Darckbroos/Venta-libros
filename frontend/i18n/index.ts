import en from './en.json';
import es from './es.json';

export const translations = { en, es };

export type Locale = 'en' | 'es';

export const defaultLocale: Locale = 'es';

export const locales: Locale[] = ['es', 'en'];

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}
