import { useCallback, useEffect, useState } from 'react';

import { OfflineService } from '../services/offlineService';

/**
 * useOffline hook - Offline holatni boshqarish
 */
export function useOffline() {
  const [isOnline, setIsOnline] = useState(OfflineService.isOnline());
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    syncing: boolean;
    lastSync: Date | null;
    pendingItems: number;
  }>({
    syncing: false,
    lastSync: null,
    pendingItems: 0,
  });

  // OfflineService'ni ishga tushirish
  useEffect(() => {
    const init = async () => {
      const result = await OfflineService.init();
      if (result.success) {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  // Ma'lumotlarni sinxronlashtirish
  const syncData = useCallback(async () => {
    setSyncStatus(prev => {
      if (prev.syncing) return prev;
      return { ...prev, syncing: true };
    });

    try {
      const result = await OfflineService.syncQueue();
      setSyncStatus({
        syncing: false,
        lastSync: new Date(),
        pendingItems: 0,
      });
      return result;
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, syncing: false }));
      return { success: false, synced: 0, errors: 0 };
    }
  }, []);

  // Online/offline holatni kuzatish
  useEffect(() => {
    const cleanup = OfflineService.onOnlineStatusChange(online => {
      setIsOnline(online);

      // Online bo'lganda avtomatik sinxronlashtirish
      if (online && isInitialized) {
        syncData();
      }
    });

    return cleanup;
  }, [isInitialized, syncData]);

  // Cache'ga saqlash
  const setCache = async (key: string, data: unknown, ttl?: number) => {
    return await OfflineService.setCache(key, data, ttl);
  };

  // Cache'dan olish
  const getCache = async (key: string) => {
    return await OfflineService.getCache(key);
  };

  // Offline queue'ga qo'shish
  const addToSyncQueue = async (
    type: 'task' | 'attendance' | 'document' | 'meeting',
    action: 'create' | 'update' | 'delete',
    data: unknown
  ) => {
    const result = await OfflineService.addToSyncQueue({
      type,
      action,
      data,
      timestamp: Date.now(),
      id: `${type}-${action}-${Date.now()}`,
    });

    if (result.success) {
      setSyncStatus(prev => ({ ...prev, pendingItems: prev.pendingItems + 1 }));
    }

    return result;
  };

  return {
    isOnline,
    isInitialized,
    syncStatus,
    syncData,
    setCache,
    getCache,
    addToSyncQueue,
  };
}
