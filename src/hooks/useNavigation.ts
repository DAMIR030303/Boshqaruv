import { useCallback } from 'react';

import { LOCAL_STORAGE_KEYS } from '../constants/app';

import { useLocalStorage } from './useLocalStorage';

/**
 * Navigation hook - Tab navigation boshqaruvi
 *
 * Bu hook aktiv tab holatini boshqaradi va foydalanuvchi tanlovini
 * localStorage'da saqlaydi. useLocalStorage hook'idan foydalanadi.
 *
 * @returns Active tab va navigation handler
 */
export function useNavigation() {
  const [activeTab, setActiveTab] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.ACTIVE_TAB,
    'dashboard'
  );

  /**
   * Tab'ga o'tish funksiyasi
   *
   * @param tab - Tab nomi
   */
  const handleNavigate = useCallback(
    (tab: string) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  return {
    activeTab,
    handleNavigate,
  };
}
