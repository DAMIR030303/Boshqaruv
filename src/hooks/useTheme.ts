import { useCallback, useLayoutEffect } from 'react';

import { LOCAL_STORAGE_KEYS } from '../constants/app';

import { useLocalStorage } from './useLocalStorage';

/**
 * Theme management hook - Dark/Light theme boshqaruvi
 *
 * Bu hook theme holatini boshqaradi va foydalanuvchi tanlovini
 * localStorage'da saqlaydi. useLocalStorage hook'idan foydalanadi.
 *
 * @returns Theme state va toggle funksiyasi
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.THEME,
    'light'
  );
  const isDark = theme === 'dark';

  // Apply theme to DOM when theme changes (useLayoutEffect to prevent flash)
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  /**
   * Theme'ni o'zgartirish funksiyasi
   *
   * Bu funksiya dark/light theme'ni o'zgartirib,
   * foydalanuvchi tanlovini localStorage'ga saqlaydi.
   * DOM yangilanishi useLayoutEffect orqali avtomatik amalga oshadi.
   */
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return {
    isDark,
    toggleTheme,
  };
}
