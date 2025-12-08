import { useState } from 'react';

import { Bell, Moon, Settings, Shield, Sun, Wifi, WifiOff } from 'lucide-react';

import type { KPIData, UserProfile } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface MobileSettingsProps {
  kpiData?: KPIData;
  userProfile?: UserProfile;
  onDataUpdate?: (_data: unknown) => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function MobileSettings({ isDark, onThemeToggle }: MobileSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <div className="mobile-content">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sozlamalar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ilova sozlamalari va parametrlari
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Theme Settings */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Mavzu
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isDark ? "Qorong'u" : "Yorug'lik"} rejim
                </p>
              </div>
            </div>
            <Button onClick={onThemeToggle} variant="secondary" size="sm">
              O'zgartirish
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Bildirishnomalar
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notificationsEnabled ? 'Yoqilgan' : "O'chirilgan"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationsEnabled
                  ? 'bg-primary-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Xavfsizlik
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2FA va boshqa sozlamalar
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Sozlash
            </Button>
          </div>
        </Card>

        {/* Offline Mode */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {offlineMode ? (
                <WifiOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Offline rejim
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {offlineMode ? 'Aktiv' : 'Nofaol'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                offlineMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  offlineMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
