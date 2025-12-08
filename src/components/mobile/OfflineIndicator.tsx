import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { CheckCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

import { useOffline } from '../../hooks/useOffline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * OfflineIndicator - Offline holatni ko'rsatish va sinxronizatsiya
 */
export function OfflineIndicator() {
  const { isOnline, syncStatus, syncData } = useOffline();
  const [showDetails, setShowDetails] = useState(false);

  // Avtomatik yashirish (3 soniyadan keyin)
  useEffect(() => {
    if (isOnline && syncStatus.lastSync) {
      const timer = setTimeout(() => {
        setShowDetails(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, syncStatus.lastSync]);

  if (isOnline && !showDetails && syncStatus.pendingItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <Card padding="sm" className="bg-white dark:bg-gray-800 shadow-lg">
        {!isOnline ? (
          <div className="flex items-center space-x-3">
            <WifiOff className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Offline rejim
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ma'lumotlar sinxronlashtirilganda saqlanadi
              </p>
            </div>
          </div>
        ) : syncStatus.pendingItems > 0 ? (
          <div className="flex items-center space-x-3">
            <RefreshCw
              className={`w-5 h-5 text-primary-500 ${syncStatus.syncing ? 'animate-spin' : ''}`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {syncStatus.syncing
                  ? 'Sinxronlashtirilmoqda...'
                  : `${syncStatus.pendingItems} ta o'zgarish kutmoqda`}
              </p>
              {syncStatus.lastSync && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Oxirgi sinxronlashtirish:{' '}
                  {format(syncStatus.lastSync, 'HH:mm', { locale: undefined })}
                </p>
              )}
            </div>
            {!syncStatus.syncing && (
              <Button variant="primary" size="sm" onClick={syncData}>
                Sinxronlashtirish
              </Button>
            )}
          </div>
        ) : syncStatus.lastSync ? (
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Barcha ma'lumotlar sinxronlashtirildi
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(syncStatus.lastSync, 'HH:mm', { locale: undefined })}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Wifi className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Online
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
