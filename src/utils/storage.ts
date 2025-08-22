import { logger } from './logger';

// Safe local storage operations
export const safeLocalStorage = {
  getItem: <T = unknown>(key: string, fallback: T | null = null): T | null => {
    try {
      if (typeof window === 'undefined') return fallback;
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      
      try {
        return JSON.parse(item);
      } catch (parseError) {
        if (typeof item === 'string' && (item === 'true' || item === 'false')) {
          return (item === 'true') as T;
        }
        return item as T;
      }
    } catch (error) {
      logger.warn(`Error reading from localStorage for key "${key}"`, error);
      return fallback;
    }
  },
  
  setItem: <T = unknown>(key: string, value: T): void => {
    try {
      if (typeof window === 'undefined') return;
      
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      logger.warn(`Error writing to localStorage for key "${key}"`, error);
    }
  },

  clearAllExcept: (keysToKeep: string[]) => {
    try {
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      logger.warn('Error clearing localStorage', error);
    }
  }
};
