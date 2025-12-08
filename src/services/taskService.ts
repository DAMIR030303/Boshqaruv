import type { ApiResponse, Task } from '../types';
import { logger } from '../utils/logger';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

/**
 * Vazifalar servisi - Vazifalar boshqaruvi
 */
export class TaskService {
  /**
   * Barcha vazifalarni olish
   */
  static async getTasks(assignee?: string): Promise<ApiResponse<Task[]>> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (assignee) {
          query = query.eq('assignee', assignee);
        }

        const { data, error } = await query;

        if (error) {
          return {
            success: false,
            error: `Vazifalarni olishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: (data || []).map(this.mapToTask),
        };
      }

      // Mock data for development
      return {
        success: true,
        data: this.getMockTasks(assignee),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Vazifalarni olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Vazifani ID bo'yicha olish
   */
  static async getTaskById(id: string): Promise<ApiResponse<Task>> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return {
            success: false,
            error: `Vazifani olishda xatolik: ${error.message}`,
          };
        }

        if (!data) {
          return {
            success: false,
            error: 'Vazifa topilmadi',
          };
        }

        return {
          success: true,
          data: this.mapToTask(data),
        };
      }

      // Mock data
      const mockTasks = this.getMockTasks();
      const task = mockTasks.find(t => t.id === id);

      if (!task) {
        return {
          success: false,
          error: 'Vazifa topilmadi',
        };
      }

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Vazifani olishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Yangi vazifa yaratish
   */
  static async createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Task>> {
    try {
      const now = new Date();

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: task.title,
            description: task.description,
            assignee: task.assignee,
            status: task.status,
            priority: task.priority,
            due_date: task.dueDate.toISOString(),
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Vazifa yaratishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToTask(data),
        };
      }

      // Mock data
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...task,
        createdAt: now,
        updatedAt: now,
      };

      return {
        success: true,
        data: newTask,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Vazifa yaratishda xatolik yuz berdi',
      };
    }
  }

  /**
   * Vazifani yangilash
   */
  static async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<ApiResponse<Task>> {
    try {
      if (isSupabaseConfigured()) {
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (updates.title) updateData.title = updates.title;
        if (updates.description) updateData.description = updates.description;
        if (updates.assignee) updateData.assignee = updates.assignee;
        if (updates.status) updateData.status = updates.status;
        if (updates.priority) updateData.priority = updates.priority;
        if (updates.dueDate)
          updateData.due_date = updates.dueDate.toISOString();

        const { data, error } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Vazifani yangilashda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          data: this.mapToTask(data),
        };
      }

      // Mock data
      const mockTasks = this.getMockTasks();
      const taskIndex = mockTasks.findIndex(t => t.id === id);

      if (taskIndex === -1) {
        return {
          success: false,
          error: 'Vazifa topilmadi',
        };
      }

      const updatedTask = {
        ...mockTasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: updatedTask,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Vazifani yangilashda xatolik yuz berdi',
      };
    }
  }

  /**
   * Vazifani o'chirish
   */
  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('tasks').delete().eq('id', id);

        if (error) {
          return {
            success: false,
            error: `Vazifani o'chirishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
        };
      }

      // Mock - always succeed
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Vazifani o'chirishda xatolik yuz berdi",
      };
    }
  }

  /**
   * Supabase ma'lumotlarini Task type'ga o'tkazish
   */
  private static mapToTask(data: Record<string, unknown>): Task {
    return {
      id: String(data.id),
      title: String(data.title),
      description: String(data.description || ''),
      assignee: String(data.assignee || ''),
      status: (data.status as Task['status']) || 'pending',
      priority: (data.priority as Task['priority']) || 'medium',
      dueDate: data.due_date ? new Date(String(data.due_date)) : new Date(),
      createdAt: data.created_at
        ? new Date(String(data.created_at))
        : new Date(),
      updatedAt: data.updated_at
        ? new Date(String(data.updated_at))
        : new Date(),
    };
  }

  /**
   * Mock vazifalar ma'lumotlari (development uchun)
   */
  private static getMockTasks(assignee?: string): Task[] {
    const tasks: Task[] = [
      {
        id: 'task-1',
        title: 'Dashboard dizaynini yangilash',
        description: 'Dashboard UI/UX dizaynini zamonaviy qilish',
        assignee: 'Javohir Tursunov',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'task-2',
        title: 'API integratsiyasi',
        description: 'Supabase API bilan integratsiya qilish',
        assignee: 'Nargiza Karimova',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'task-3',
        title: 'Testlar yozish',
        description: 'Barcha komponentlar uchun unit testlar yozish',
        assignee: 'Javohir Tursunov',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    if (assignee) {
      return tasks.filter(t => t.assignee === assignee);
    }

    return tasks;
  }

  /**
   * Vazifalarni real-time kuzatish
   *
   * @param assignee - Vazifalarni filter qilish uchun assignee (ixtiyoriy)
   * @param callbacks - Event handler'lar
   * @returns Cleanup funksiyasi (subscription'ni to'xtatish uchun)
   */
  static subscribeToTasks(
    assignee?: string,
    callbacks?: {
      onInsert?: (task: Task) => void;
      onUpdate?: (task: Task) => void;
      onDelete?: (task: Task) => void;
    }
  ): () => void {
    if (!isSupabaseConfigured()) {
      return () => {};
    }

    try {
      const channelName = `tasks${assignee ? `:${assignee}` : ''}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks',
            filter: assignee ? `assignee=eq.${assignee}` : undefined,
          },
          payload => {
            const eventType = payload.eventType;
            const task = this.mapToTask(
              (payload.new as Record<string, unknown>) ||
                (payload.old as Record<string, unknown>)
            );

            if (eventType === 'INSERT' && payload.new) {
              callbacks?.onInsert?.(task);
            } else if (eventType === 'UPDATE' && payload.new) {
              callbacks?.onUpdate?.(task);
            } else if (eventType === 'DELETE' && payload.old) {
              callbacks?.onDelete?.(task);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      logger.error(
        'Vazifalarni real-time kuzatishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
      return () => {};
    }
  }
}
