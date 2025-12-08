/**
 * i18n (Internationalization) Configuration
 *
 * Bu fayl xalqaro til qo'llab-quvvatlash uchun asosiy konfiguratsiyani o'z ichiga oladi.
 * Hozirda oddiy JSON fayllar ishlatilmoqda, kelajakda react-i18next yoki o'xshash
 * kutubxonani qo'shish mumkin.
 */

import enTranslations from './en.json';
import ruTranslations from './ru.json';
import uzTranslations from './uz.json';

export type SupportedLanguage = 'uz' | 'en' | 'ru';

export interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<SupportedLanguage, Translations> = {
  uz: uzTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

/**
 * Default til - O'zbek tili
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'uz';

/**
 * Qo'llab-quvvatlanadigan tillar ro'yxati
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['uz', 'en', 'ru'];

/**
 * Tarjima olish funksiyasi
 *
 * @param key - Tarjima kaliti (masalan: "auth.login.title")
 * @param lang - Til kodi (default: DEFAULT_LANGUAGE)
 * @param fallback - Agar tarjima topilmasa, qaytariladigan qiymat
 * @returns Tarjima matni yoki fallback qiymati
 *
 * @example
 * ```ts
 * const title = getTranslation('auth.login.title', 'uz');
 * // "Boshqaruv tizimiga kirish"
 * ```
 */
export function getTranslation(
  key: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE,
  fallback?: string
): string {
  const keys = key.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to Uzbek if translation not found
      if (lang !== DEFAULT_LANGUAGE) {
        return getTranslation(key, DEFAULT_LANGUAGE, fallback);
      }
      return fallback || key;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  return fallback || key;
}

/**
 * Nested tarjima olish (obyekt qaytaradi)
 *
 * @param key - Tarjima kaliti
 * @param lang - Til kodi
 * @returns Tarjima obyekti yoki null
 */
export function getTranslationObject(
  key: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE
): Translations | null {
  const keys = key.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      if (lang !== DEFAULT_LANGUAGE) {
        return getTranslationObject(key, DEFAULT_LANGUAGE);
      }
      return null;
    }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Translations;
  }

  return null;
}

/**
 * Barcha tarjimalarni olish
 *
 * @param lang - Til kodi
 * @returns Barcha tarjimalar obyekti
 */
export function getAllTranslations(
  lang: SupportedLanguage = DEFAULT_LANGUAGE
): Translations {
  return translations[lang];
}

/**
 * Til nomini olish
 *
 * @param lang - Til kodi
 * @returns Til nomi
 */
export function getLanguageName(lang: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    uz: "O'zbek",
    en: 'English',
    ru: 'Русский',
  };
  return names[lang];
}
