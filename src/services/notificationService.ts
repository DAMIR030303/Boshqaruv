import { addMinutes, differenceInMinutes, isBefore } from 'date-fns';

import type { NotificationItem } from '../types';
import { logger } from '../utils/logger';
import { safeLocalStorage } from '../utils/storage';

import { CalendarService } from './calendarService';
import { MeetingService } from './meetingService';
import { TaskService } from './taskService';

/**
 * Notification servisi - Kontur.Diadoc uslubida
 * Faqat foydali bildirishnomalar (vazifalar, muddatlar, uchrashuvlar)
 */
export class NotificationService {
  private static checkInterval: number | null = null;
  private static listeners: Array<(notifications: NotificationItem[]) => void> =
    [];
  private static readonly STORAGE_KEY = 'boshqaruv_notifications';
  private static readonly READ_KEY = 'boshqaruv_notifications_read';

  /**
   * Eslatmalarni tekshirish va yaratish
   */
  static async checkNotifications(
    userName?: string
  ): Promise<NotificationItem[]> {
    const notifications: NotificationItem[] = [];
    const readIds = this.getReadNotificationIds();

    try {
      // Vazifalar eslatmalari - muddati yaqinlashayotgan vazifalar
      const tasksResult = await TaskService.getTasks();
      if (tasksResult.success && tasksResult.data) {
        const now = new Date();
        for (const task of tasksResult.data) {
          // Faqat pending va in-progress vazifalar
          if (task.status === 'pending' || task.status === 'in-progress') {
            const hoursUntilDue =
              (task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            const notificationId = `task-deadline-${task.id}`;

            // O'qilgan bildirishnomalarni o'tkazib yuborish
            if (readIds.has(notificationId)) {
              continue;
            }

            // Muddati 24 soat ichida tugaydigan vazifalar
            if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
              notifications.push({
                id: notificationId,
                type: 'deadline',
                title: 'Muddat yaqinlashmoqda',
                message: `"${task.title}" vazifasining muddati ${task.dueDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} da tugaydi`,
                timestamp: new Date(),
                priority: hoursUntilDue <= 2 ? 'high' : 'medium',
                actionUrl: `/tasks/${task.id}`,
              });
            }

            // Muddati o'tib ketgan vazifalar
            if (hoursUntilDue < 0) {
              notifications.push({
                id: `task-overdue-${task.id}`,
                type: 'deadline',
                title: "Muddat o'tib ketdi",
                message: `"${task.title}" vazifasining muddati o'tib ketdi`,
                timestamp: new Date(),
                priority: 'high',
                actionUrl: `/tasks/${task.id}`,
              });
            }
          }
        }
      }

      // Muddatlar eslatmalari
      const deadlinesResult = await CalendarService.getUpcomingDeadlines(
        7,
        userName
      );
      if (deadlinesResult.success && deadlinesResult.data) {
        for (const deadline of deadlinesResult.data) {
          const notificationId = `deadline-${deadline.id}`;

          // O'qilgan bildirishnomalarni o'tkazib yuborish
          if (readIds.has(notificationId)) {
            continue;
          }

          // Muddati bugun bo'lgan vazifalar
          if (
            isBefore(deadline.dueDate, addMinutes(new Date(), 60)) &&
            !deadline.reminderSent
          ) {
            notifications.push({
              id: notificationId,
              type: 'deadline',
              title: 'Muddat yaqinlashmoqda',
              message: `"${deadline.title}" vazifasining muddati ${deadline.dueDate.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} da tugaydi`,
              timestamp: new Date(),
              priority: deadline.status === 'overdue' ? 'high' : 'medium',
              actionUrl: `/tasks/${deadline.taskId}`,
            });
          }
        }
      }

      // Uchrashuvlar eslatmalari
      const meetingsResult = await MeetingService.getUpcomingMeetings(
        1,
        userName
      );
      if (meetingsResult.success && meetingsResult.data) {
        for (const meeting of meetingsResult.data) {
          const minutesUntil = differenceInMinutes(
            meeting.startTime,
            new Date()
          );
          const notificationId = `meeting-${meeting.id}`;

          // O'qilgan bildirishnomalarni o'tkazib yuborish
          if (readIds.has(notificationId)) {
            continue;
          }

          // 15 daqiqa oldin eslatma
          if (minutesUntil <= 15 && minutesUntil > 0 && !meeting.reminderSent) {
            notifications.push({
              id: notificationId,
              type: 'meeting',
              title: 'Uchrashuv tez orada',
              message: `"${meeting.title}" uchrashuvi ${minutesUntil} daqiqadan keyin boshlanadi`,
              timestamp: new Date(),
              priority: minutesUntil <= 5 ? 'high' : 'medium',
              actionUrl: `/meetings/${meeting.id}`,
            });
          }

          // Uchrashuv boshlandi
          if (minutesUntil <= 0 && meeting.status === 'scheduled') {
            notifications.push({
              id: `meeting-start-${meeting.id}`,
              type: 'meeting',
              title: 'Uchrashuv boshlandi',
              message: `"${meeting.title}" uchrashuvi boshlandi`,
              timestamp: new Date(),
              priority: 'high',
              actionUrl: `/meetings/${meeting.id}`,
            });
          }
        }
      }

      // Saqlangan bildirishnomalarni qo'shish
      const savedNotifications = this.getSavedNotifications();
      const newSavedNotifications = notifications.filter(
        n => !savedNotifications.some(sn => sn.id === n.id)
      );

      // Yangi bildirishnomalarni saqlash
      if (newSavedNotifications.length > 0) {
        this.saveNotifications([
          ...savedNotifications,
          ...newSavedNotifications,
        ]);
      }

      // Barcha bildirishnomalarni qaytarish (o'qilgan va o'qilmagan)
      return [...savedNotifications, ...notifications].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
    } catch (error) {
      logger.error(
        'Eslatmalarni tekshirishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      // Xatolik bo'lsa ham saqlangan bildirishnomalarni qaytarish
      return this.getSavedNotifications();
    }
  }

  /**
   * Eslatmalarni real-time tekshirishni boshlash
   */
  static startChecking(intervalMinutes: number = 5, userName?: string): void {
    if (this.checkInterval) {
      this.stopChecking();
    }

    // Birinchi marta tekshirish
    this.checkNotifications(userName).then(notifications => {
      this.notifyListeners(notifications);
    });

    // Interval'da tekshirish
    this.checkInterval = window.setInterval(
      async () => {
        const notifications = await this.checkNotifications(userName);
        this.notifyListeners(notifications);
      },
      intervalMinutes * 60 * 1000
    );
  }

  /**
   * Eslatmalarni tekshirishni to'xtatish
   */
  static stopChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Listener qo'shish
   */
  static addListener(
    listener: (notifications: NotificationItem[]) => void
  ): void {
    this.listeners.push(listener);
  }

  /**
   * Listener olib tashlash
   */
  static removeListener(
    listener: (notifications: NotificationItem[]) => void
  ): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Barcha listener'larni xabardor qilish
   */
  private static notifyListeners(notifications: NotificationItem[]): void {
    this.listeners.forEach(listener => {
      try {
        listener(notifications);
      } catch (error) {
        logger.error(
          'Listener xatolik',
          error instanceof Error ? error : new Error(String(error))
        );
      }
    });
  }

  /**
   * Browser notification yaratish
   */
  static async showBrowserNotification(
    notification: NotificationItem
  ): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    // Permission tekshirish
    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      return;
    }

    // O'qilgan bildirishnomalarni o'tkazib yuborish
    const readIds = this.getReadNotificationIds();
    if (readIds.has(notification.id)) {
      return;
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high',
        silent: notification.priority === 'low',
      };

      const browserNotification = new Notification(
        notification.title,
        notificationOptions
      );

      // Click handler - bildirishnomani ochish
      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto close after 5 seconds for low priority
      if (notification.priority === 'low') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    } catch (error) {
      logger.error(
        'Browser notification yaratishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Barcha eslatmalarni ko'rsatish
   */
  static async showAllNotifications(userName?: string): Promise<void> {
    const notifications = await this.checkNotifications(userName);

    // Faqat o'qilmagan bildirishnomalarni ko'rsatish
    const readIds = this.getReadNotificationIds();
    const unreadNotifications = notifications.filter(n => !readIds.has(n.id));

    for (const notification of unreadNotifications) {
      await this.showBrowserNotification(notification);
    }
  }

  /**
   * Bildirishnomani o'qilgan deb belgilash
   */
  static markAsRead(notificationId: string): void {
    try {
      const readIds = this.getReadNotificationIds();
      readIds.add(notificationId);
      safeLocalStorage.setItem(this.READ_KEY, Array.from(readIds));

      // Listener'larni xabardor qilish
      this.notifyListeners(this.getSavedNotifications());
    } catch (error) {
      logger.error(
        "Bildirishnomani o'qilgan deb belgilashda xatolik",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Barcha bildirishnomalarni o'qilgan deb belgilash
   */
  static markAllAsRead(): void {
    try {
      const notifications = this.getSavedNotifications();
      const readIds = new Set(notifications.map(n => n.id));
      safeLocalStorage.setItem(this.READ_KEY, Array.from(readIds));

      // Listener'larni xabardor qilish
      this.notifyListeners([]);
    } catch (error) {
      logger.error(
        "Barcha bildirishnomalarni o'qilgan deb belgilashda xatolik",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Bildirishnomani o'chirish
   */
  static deleteNotification(notificationId: string): void {
    try {
      const notifications = this.getSavedNotifications();
      const filtered = notifications.filter(n => n.id !== notificationId);
      this.saveNotifications(filtered);

      // Listener'larni xabardor qilish
      this.notifyListeners(filtered);
    } catch (error) {
      logger.error(
        "Bildirishnomani o'chirishda xatolik",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Saqlangan bildirishnomalarni olish
   */
  private static getSavedNotifications(): NotificationItem[] {
    try {
      const notifications =
        safeLocalStorage.getItem<NotificationItem[]>(this.STORAGE_KEY, []) ??
        [];
      return notifications.map(n => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    } catch (error) {
      logger.error(
        'Saqlangan bildirishnomalarni olishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      return [];
    }
  }

  /**
   * Bildirishnomalarni saqlash
   */
  private static saveNotifications(notifications: NotificationItem[]): void {
    try {
      // Faqat oxirgi 50 ta bildirishnomani saqlash
      const limited = notifications.slice(0, 50);
      safeLocalStorage.setItem(this.STORAGE_KEY, limited);
    } catch (error) {
      logger.error(
        'Bildirishnomalarni saqlashda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * O'qilgan bildirishnomalar ID'larini olish
   */
  private static getReadNotificationIds(): Set<string> {
    try {
      const ids = safeLocalStorage.getItem<string[]>(this.READ_KEY, []) ?? [];
      return new Set(ids);
    } catch (error) {
      logger.error(
        "O'qilgan bildirishnomalarni olishda xatolik",
        error instanceof Error ? error : new Error(String(error))
      );
      return new Set();
    }
  }

  /**
   * O'qilmagan bildirishnomalar sonini olish
   */
  static getUnreadCount(): number {
    try {
      const notifications = this.getSavedNotifications();
      const readIds = this.getReadNotificationIds();
      return notifications.filter(n => !readIds.has(n.id)).length;
    } catch (error) {
      logger.error(
        "O'qilmagan bildirishnomalar sonini olishda xatolik",
        error instanceof Error ? error : new Error(String(error))
      );
      return 0;
    }
  }
}
