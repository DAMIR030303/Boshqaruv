import { useCallback, useEffect, useState } from 'react';

import { logger } from '../utils/logger';
import { safeLocalStorage } from '../utils/storage';

/**
 * useLocalStorage hook - localStorage bilan ishlash uchun umumiy hook
 *
 * Bu hook localStorage'da ma'lumotlarni saqlash va o'qish uchun
 * umumiy pattern taqdim etadi. State va localStorage'ni sinxronlashtiradi.
 *
 * @template T - Saqlanadigan ma'lumot turi
 * @param key - localStorage kaliti
 * @param initialValue - Boshlang'ich qiymat (agar localStorage'da ma'lumot bo'lmasa)
 * @returns [value, setValue] - State va setter funksiyasi
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // State'ni localStorage'dan o'qish yoki initialValue bilan boshlash
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = safeLocalStorage.getItem<T>(key, null);
      return item !== null ? item : initialValue;
    } catch (error) {
      // Xato bo'lsa, initialValue qaytaradi
      return initialValue;
    }
  });

  // localStorage'ni yangilash funksiyasi
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Agar value funksiya bo'lsa, uni chaqirib natijani olish
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // State'ni yangilash
        setStoredValue(valueToStore);

        // localStorage'ni yangilash
        safeLocalStorage.setItem(key, valueToStore);
      } catch (error) {
        // Xato bo'lsa, logger orqali yozadi
        logger.error(
          `Error setting localStorage key "${key}"`,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    },
    [key, storedValue]
  );

  // localStorage o'zgarishlarini kuzatish (boshqa tab/window'dan)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsedValue = JSON.parse(e.newValue);
          setStoredValue(parsedValue);
        } catch {
          // JSON parse xatosi bo'lsa, string sifatida saqlash
          setStoredValue(e.newValue as unknown as T);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
