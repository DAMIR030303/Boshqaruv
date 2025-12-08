import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';

import { NotificationService } from '../../services/notificationService';
import type { NotificationItem } from '../../types';
import { logger } from '../../utils/logger';
import { EmptyState } from '../ui/EmptyState';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

/**
 * Bildirishnomalar dropdown komponenti
 *
 * Bu komponent foydalanuvchiga bildirishnomalarni ko'rsatadi
 * va NotificationService bilan integratsiya qilingan.
 */
export function NotificationsDropdown({
  isOpen,
  onClose,
  userName,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await NotificationService.checkNotifications(userName);
      setNotifications(result);
    } catch (error) {
      logger.error(
        'Bildirishnomalarni yuklashda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [userName]);

  // Bildirishnomalarni yuklash
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape, { capture: true });
      return () =>
        document.removeEventListener('keydown', handleEscape, {
          capture: true,
        });
    }
  }, [isOpen, onClose]);

  // Bildirishnomani o'qilgan deb belgilash
  const markAsRead = async (id: string) => {
    NotificationService.markAsRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Barcha bildirishnomalarni o'chirish
  const clearAll = () => {
    NotificationService.markAllAsRead();
    setNotifications([]);
  };

  // Priority rangini olish
  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20"
          />

          {/* Dropdown */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-30 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bildirishnomalar
                </h3>
                {notifications.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Tozalash
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Yuklanmoqda...
                </div>
              ) : notifications.length === 0 ? (
                <EmptyState
                  variant="notifications"
                  compact
                  onAction={loadNotifications}
                />
              ) : (
                <div className="space-y-2">
                  {notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border ${getPriorityColor(notification.priority)} cursor-pointer hover:shadow-md transition-all`}
                      onClick={() => {
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                        markAsRead(notification.id);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(notification.timestamp).toLocaleString(
                              'uz-UZ',
                              {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            NotificationService.deleteNotification(
                              notification.id
                            );
                            markAsRead(notification.id);
                          }}
                          className="ml-2 p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                          aria-label="O'chirish"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
