import { describe, expect, it } from 'vitest';

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getAllTranslations,
  getLanguageName,
  getTranslation,
  getTranslationObject,
} from '../index';

describe('i18n', () => {
  describe('getTranslation', () => {
    it('returns translation for existing key', () => {
      const result = getTranslation('common.save', 'uz');
      expect(result).toBe('Saqlash');
    });

    it('returns nested translation', () => {
      const result = getTranslation('auth.login.title', 'uz');
      expect(result).toBe('Boshqaruv tizimiga kirish');
    });

    it('returns fallback when key does not exist', () => {
      const result = getTranslation('non.existent.key', 'uz', 'Fallback');
      expect(result).toBe('Fallback');
    });

    it('returns key when key does not exist and no fallback', () => {
      const result = getTranslation('non.existent.key', 'uz');
      expect(result).toBe('non.existent.key');
    });

    it('falls back to Uzbek when translation not found in other language', () => {
      const result = getTranslation('common.save', 'en');
      expect(result).toBe('Save');
    });

    it('handles English translations', () => {
      const result = getTranslation('common.save', 'en');
      expect(result).toBe('Save');
    });

    it('handles Russian translations', () => {
      const result = getTranslation('common.save', 'ru');
      expect(result).toBe('Сохранить');
    });
  });

  describe('getTranslationObject', () => {
    it('returns translation object for existing key', () => {
      const result = getTranslationObject('common', 'uz');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('save');
    });

    it('returns null for non-existent key', () => {
      const result = getTranslationObject('non.existent', 'uz');
      expect(result).toBeNull();
    });

    it('returns nested object', () => {
      const result = getTranslationObject('auth.login', 'uz');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('title');
    });
  });

  describe('getAllTranslations', () => {
    it('returns all translations for Uzbek', () => {
      const result = getAllTranslations('uz');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('common');
      expect(result).toHaveProperty('auth');
    });

    it('returns all translations for English', () => {
      const result = getAllTranslations('en');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('common');
    });

    it('returns all translations for Russian', () => {
      const result = getAllTranslations('ru');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('common');
    });
  });

  describe('getLanguageName', () => {
    it('returns correct name for Uzbek', () => {
      expect(getLanguageName('uz')).toBe("O'zbek");
    });

    it('returns correct name for English', () => {
      expect(getLanguageName('en')).toBe('English');
    });

    it('returns correct name for Russian', () => {
      expect(getLanguageName('ru')).toBe('Русский');
    });
  });

  describe('constants', () => {
    it('has correct default language', () => {
      expect(DEFAULT_LANGUAGE).toBe('uz');
    });

    it('has correct supported languages', () => {
      expect(SUPPORTED_LANGUAGES).toEqual(['uz', 'en', 'ru']);
    });
  });
});
