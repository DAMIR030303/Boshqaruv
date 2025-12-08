/**
 * Offline servisi - Service Worker, IndexedDB, background sync
 * Internet bo'lmasa ham ishlash imkoniyati
 */

interface OfflineData {
  type: 'task' | 'attendance' | 'document' | 'meeting';
  action: 'create' | 'update' | 'delete';
  data: unknown;
  timestamp: number;
  id: string;
}

/**
 * Offline servisi - IndexedDB va Service Worker integratsiyasi
 */
export class OfflineService {
  private static dbName = 'boshqaruv-offline';
  private static dbVersion = 1;
  private static db: IDBDatabase | null = null;

  /**
   * IndexedDB'ni ishga tushirish
   */
  static async init(): Promise<{ success: boolean; error?: string }> {
    try {
      return new Promise(resolve => {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => {
          resolve({
            success: false,
            error: 'IndexedDB ochishda xatolik',
          });
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve({ success: true });
        };

        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Sync queue store
          if (!db.objectStoreNames.contains('syncQueue')) {
            const syncStore = db.createObjectStore('syncQueue', {
              keyPath: 'id',
              autoIncrement: false,
            });
            syncStore.createIndex('timestamp', 'timestamp', { unique: false });
            syncStore.createIndex('type', 'type', { unique: false });
          }

          // Cache store
          if (!db.objectStoreNames.contains('cache')) {
            const cacheStore = db.createObjectStore('cache', {
              keyPath: 'key',
            });
            cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Noma'lum xatolik",
      };
    }
  }

  /**
   * Ma'lumotlarni offline queue'ga qo'shish
   */
  static async addToSyncQueue(
    data: OfflineData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) {
        const initResult = await this.init();
        if (!initResult.success) {
          return initResult;
        }
      }

      return new Promise(resolve => {
        if (!this.db) {
          resolve({ success: false, error: 'Database topilmadi' });
          return;
        }

        const transaction = this.db.transaction(['syncQueue'], 'readwrite');
        const store = transaction.objectStore('syncQueue');
        const request = store.add(data);

        request.onsuccess = () => {
          resolve({ success: true });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: "Sync queue'ga qo'shishda xatolik",
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Noma'lum xatolik",
      };
    }
  }

  /**
   * Cache'ga ma'lumot saqlash
   */
  static async setCache(
    key: string,
    data: unknown,
    ttl: number = 3600000
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.db) {
        const initResult = await this.init();
        if (!initResult.success) {
          return initResult;
        }
      }

      return new Promise(resolve => {
        if (!this.db) {
          resolve({ success: false, error: 'Database topilmadi' });
          return;
        }

        const transaction = this.db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.put({
          key,
          data,
          timestamp: Date.now(),
          expiresAt: Date.now() + ttl,
        });

        request.onsuccess = () => {
          resolve({ success: true });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: "Cache'ga saqlashda xatolik",
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Noma'lum xatolik",
      };
    }
  }

  /**
   * Cache'dan ma'lumot olish
   */
  static async getCache(
    key: string
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      if (!this.db) {
        const initResult = await this.init();
        if (!initResult.success) {
          return { success: false, error: initResult.error };
        }
      }

      return new Promise(resolve => {
        if (!this.db) {
          resolve({ success: false, error: 'Database topilmadi' });
          return;
        }

        const transaction = this.db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve({ success: false, error: "Ma'lumot topilmadi" });
            return;
          }

          // TTL tekshirish
          if (result.expiresAt && Date.now() > result.expiresAt) {
            // Expired - o'chirish
            store.delete(key);
            resolve({ success: false, error: "Ma'lumot muddati o'tgan" });
            return;
          }

          resolve({
            success: true,
            data: result.data,
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: "Cache'dan olishda xatolik",
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Noma'lum xatolik",
      };
    }
  }

  /**
   * Sync queue'ni sinxronlashtirish
   */
  static async syncQueue(): Promise<{
    success: boolean;
    synced: number;
    errors: number;
  }> {
    try {
      if (!this.db) {
        const initResult = await this.init();
        if (!initResult.success) {
          return { success: false, synced: 0, errors: 0 };
        }
      }

      if (!this.db) {
        return { success: false, synced: 0, errors: 0 };
      }

      // Sync queue'dan barcha ma'lumotlarni olish
      return new Promise(resolve => {
        const transaction = this.db!.transaction(['syncQueue'], 'readonly');
        const store = transaction.objectStore('syncQueue');
        const request = store.getAll();

        request.onsuccess = async () => {
          const items = request.result as OfflineData[];
          let synced = 0;
          let errors = 0;

          // Har bir item'ni sinxronlashtirish
          for (const item of items) {
            try {
              // Bu yerda real API call bo'lishi kerak
              // Hozircha mock
              await new Promise(resolve => setTimeout(resolve, 100));

              // Muvaffaqiyatli sinxronlashtirilgan item'ni o'chirish
              const deleteTransaction = this.db!.transaction(
                ['syncQueue'],
                'readwrite'
              );
              const deleteStore = deleteTransaction.objectStore('syncQueue');
              deleteStore.delete(item.id);

              synced++;
            } catch (error) {
              errors++;
            }
          }

          resolve({ success: true, synced, errors });
        };

        request.onerror = () => {
          resolve({ success: false, synced: 0, errors: 0 });
        };
      });
    } catch (error) {
      return { success: false, synced: 0, errors: 0 };
    }
  }

  /**
   * Online/offline holatni tekshirish
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Online/offline event listener qo'shish
   */
  static onOnlineStatusChange(
    callback: (isOnline: boolean) => void
  ): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup funksiyasi
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  /**
   * Cache'ni tozalash (expired items)
   */
  static async clearExpiredCache(): Promise<{
    success: boolean;
    cleared: number;
  }> {
    try {
      if (!this.db) {
        const initResult = await this.init();
        if (!initResult.success) {
          return { success: false, cleared: 0 };
        }
      }

      if (!this.db) {
        return { success: false, cleared: 0 };
      }

      return new Promise(resolve => {
        const transaction = this.db!.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const index = store.index('timestamp');
        const request = index.openCursor();

        let cleared = 0;

        request.onsuccess = event => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
            .result;
          if (cursor) {
            const item = cursor.value;
            if (item.expiresAt && Date.now() > item.expiresAt) {
              cursor.delete();
              cleared++;
            }
            cursor.continue();
          } else {
            resolve({ success: true, cleared });
          }
        };

        request.onerror = () => {
          resolve({ success: false, cleared: 0 });
        };
      });
    } catch (error) {
      return { success: false, cleared: 0 };
    }
  }

  /**
   * Barcha cache'ni tozalash
   */
  static async clearAllCache(): Promise<{ success: boolean }> {
    try {
      if (!this.db) {
        const initResult = await this.init();
        if (!initResult.success) {
          return { success: false };
        }
      }

      if (!this.db) {
        return { success: false };
      }

      return new Promise(resolve => {
        const transaction = this.db!.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.clear();

        request.onsuccess = () => {
          resolve({ success: true });
        };

        request.onerror = () => {
          resolve({ success: false });
        };
      });
    } catch (error) {
      return { success: false };
    }
  }
}
