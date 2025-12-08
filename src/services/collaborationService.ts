import type { Activity, ApiResponse, ChatMessage, Comment } from '../types';
import { safeLocalStorage } from '../utils/storage';
import { supabase } from '../utils/supabaseClient';

import { TaskService } from './taskService';

/**
 * Collaboration servisi - Real-time comments, activity feed, team chat
 * Jamoa bilan samarali ishlash
 */
export class CollaborationService {
  /**
   * Sharhlarni olish
   */
  static async getComments(
    entityType: Comment['entityType'],
    entityId: string
  ): Promise<ApiResponse<Comment[]>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      const comments =
        safeLocalStorage.getItem<Comment[]>(
          `comments-${entityType}-${entityId}`,
          []
        ) ?? [];

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = comments.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
        replies: c.replies?.map(r => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
        })),
      }));

      return {
        success: true,
        data: parsed,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Sharhlarni olishda xatolik',
      };
    }
  }

  /**
   * Sharh qo'shish
   */
  static async addComment(
    entityType: Comment['entityType'],
    entityId: string,
    author: string,
    content: string,
    mentions?: string[]
  ): Promise<ApiResponse<Comment>> {
    try {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        entityType,
        entityId,
        author,
        content,
        mentions,
        createdAt: new Date(),
      };

      // LocalStorage'ga saqlash
      const comments =
        safeLocalStorage.getItem<Comment[]>(
          `comments-${entityType}-${entityId}`,
          []
        ) ?? [];
      comments.push(comment);
      safeLocalStorage.setItem(`comments-${entityType}-${entityId}`, comments);

      // Activity yaratish
      await this.addActivity({
        type: 'comment_added',
        actor: author,
        target: entityId,
        description: `${author} ${entityType} ga sharh qo'shdi`,
      });

      return {
        success: true,
        data: comment,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Sharh qo'shishda xatolik",
      };
    }
  }

  /**
   * Sharhni yangilash
   */
  static async updateComment(
    commentId: string,
    entityType: Comment['entityType'],
    entityId: string,
    content: string
  ): Promise<ApiResponse<Comment>> {
    try {
      const comments =
        safeLocalStorage.getItem<Comment[]>(
          `comments-${entityType}-${entityId}`,
          []
        ) ?? [];
      const index = comments.findIndex(c => c.id === commentId);

      if (index === -1) {
        return {
          success: false,
          error: 'Sharh topilmadi',
        };
      }

      comments[index] = {
        ...comments[index],
        content,
        updatedAt: new Date(),
      };

      safeLocalStorage.setItem(`comments-${entityType}-${entityId}`, comments);

      return {
        success: true,
        data: comments[index],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Sharh yangilashda xatolik',
      };
    }
  }

  /**
   * Sharhni o'chirish
   */
  static async deleteComment(
    commentId: string,
    entityType: Comment['entityType'],
    entityId: string
  ): Promise<ApiResponse<void>> {
    try {
      const comments =
        safeLocalStorage.getItem<Comment[]>(
          `comments-${entityType}-${entityId}`,
          []
        ) ?? [];
      const filtered = comments.filter(c => c.id !== commentId);
      safeLocalStorage.setItem(`comments-${entityType}-${entityId}`, filtered);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Sharh o'chirishda xatolik",
      };
    }
  }

  /**
   * Activity feed olish - Real ma'lumotlar bilan
   */
  static async getActivityFeed(
    limit: number = 50
  ): Promise<ApiResponse<Activity[]>> {
    try {
      const activities: Activity[] = [];

      // Vazifalardan activity'larni olish
      const tasksResult = await TaskService.getTasks();
      if (tasksResult.success && tasksResult.data) {
        for (const task of tasksResult.data) {
          // Yangi yaratilgan vazifalar
          const createdHoursAgo =
            (Date.now() - task.createdAt.getTime()) / (1000 * 60 * 60);
          if (createdHoursAgo <= 24) {
            activities.push({
              id: `task-created-${task.id}`,
              type: 'task_created',
              actor: task.assignee,
              target: task.id,
              description: `"${task.title}" vazifasi yaratildi`,
              timestamp: task.createdAt,
            });
          }

          // Bajarilgan vazifalar
          if (task.status === 'completed') {
            const completedHoursAgo =
              (Date.now() - task.updatedAt.getTime()) / (1000 * 60 * 60);
            if (completedHoursAgo <= 24) {
              activities.push({
                id: `task-completed-${task.id}`,
                type: 'task_completed',
                actor: task.assignee,
                target: task.id,
                description: `"${task.title}" vazifasi bajarildi`,
                timestamp: task.updatedAt,
              });
            }
          }

          // Status o'zgargan vazifalar
          const updatedHoursAgo =
            (Date.now() - task.updatedAt.getTime()) / (1000 * 60 * 60);
          if (
            updatedHoursAgo <= 24 &&
            task.updatedAt.getTime() !== task.createdAt.getTime()
          ) {
            activities.push({
              id: `task-status-${task.id}`,
              type: 'status_changed',
              actor: task.assignee,
              target: task.id,
              description: `"${task.title}" vazifasining holati "${task.status === 'pending' ? 'Kutilmoqda' : task.status === 'in-progress' ? 'Jarayonda' : 'Bajarilgan'}" ga o'zgardi`,
              timestamp: task.updatedAt,
            });
          }
        }
      }

      // Saqlangan activity'larni qo'shish (comments, documents, etc.)
      const savedActivities =
        safeLocalStorage.getItem<Activity[]>('activities', []) ?? [];
      const parsedSaved = savedActivities.map(a => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));

      // Barcha activity'larni birlashtirish va tartiblash
      const allActivities = [...activities, ...parsedSaved]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return {
        success: true,
        data: allActivities,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Activity feed olishda xatolik',
      };
    }
  }

  /**
   * Activity qo'shish
   */
  static async addActivity(
    activity: Omit<Activity, 'id' | 'timestamp'>
  ): Promise<ApiResponse<Activity>> {
    try {
      const newActivity: Activity = {
        ...activity,
        id: `activity-${Date.now()}`,
        timestamp: new Date(),
      };

      // LocalStorage'ga saqlash
      const activities =
        safeLocalStorage.getItem<Activity[]>('activities', []) ?? [];
      activities.push(newActivity);

      // Faqat oxirgi 1000 ta activity'ni saqlash
      const limited = activities.slice(-1000);
      safeLocalStorage.setItem('activities', limited);

      return {
        success: true,
        data: newActivity,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Activity qo'shishda xatolik",
      };
    }
  }

  /**
   * Chat xabarlarini olish
   */
  static async getChatMessages(
    channel: string,
    limit: number = 100
  ): Promise<ApiResponse<ChatMessage[]>> {
    try {
      // Hozircha localStorage'da saqlaymiz
      const messages =
        safeLocalStorage.getItem<ChatMessage[]>(`chat-${channel}`, []) ?? [];

      // Date'lar string sifatida saqlangan bo'lishi mumkin
      const parsed = messages
        .map(m => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-limit);

      return {
        success: true,
        data: parsed,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Chat xabarlarini olishda xatolik',
      };
    }
  }

  /**
   * Chat xabari yuborish
   */
  static async sendChatMessage(
    channel: string,
    author: string,
    content: string,
    mentions?: string[]
  ): Promise<ApiResponse<ChatMessage>> {
    try {
      const message: ChatMessage = {
        id: `message-${Date.now()}`,
        channel,
        author,
        content,
        mentions,
        timestamp: new Date(),
      };

      // LocalStorage'ga saqlash
      const messages =
        safeLocalStorage.getItem<ChatMessage[]>(`chat-${channel}`, []) ?? [];
      messages.push(message);

      // Faqat oxirgi 500 ta xabarni saqlash
      const limited = messages.slice(-500);
      safeLocalStorage.setItem(`chat-${channel}`, limited);

      return {
        success: true,
        data: message,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Xabar yuborishda xatolik',
      };
    }
  }

  /**
   * @Mentions'ni aniqlash
   */
  static parseMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  }

  /**
   * Real-time subscription (Supabase Realtime)
   */
  static subscribeToComments(
    entityType: Comment['entityType'],
    entityId: string,
    callback: (comment: Comment) => void
  ): () => void {
    // Supabase Realtime subscription
    // Hozircha mock
    const channel = supabase
      .channel(`comments:${entityType}:${entityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `entity_type=eq.${entityType} AND entity_id=eq.${entityId}`,
        },
        payload => {
          callback(payload.new as Comment);
        }
      )
      .subscribe();

    // Cleanup funksiyasi
    return () => {
      supabase.removeChannel(channel);
    };
  }
}
