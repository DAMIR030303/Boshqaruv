import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type { ApiResponse, CalendarEvent, Deadline, Task } from '../types';
import { supabase } from '../utils/supabaseClient';

/**
 * Kalendar servisi - Kontur.Extern uslubida
 * Kalendar eventlari, muddatlar va eslatmalar boshqaruvi
 */
export class CalendarService {
  /**
   * Kalendar eventlarini olish
   */
  static async getEvents(
    startDate: Date,
    endDate: Date,
    assignee?: string
  ): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      // Supabase'dan vazifalarni olish
      let query = supabase
        .from('tasks')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (assignee) {
        query = query.eq('assignee', assignee);
      }

      const { data: tasks, error } = await query;

      if (error) {
        return {
          success: false,
          error: `Eventlarni olishda xatolik: ${error.message}`,
        };
      }

      // Task'larni CalendarEvent'larga o'tkazish
      const events: CalendarEvent[] = (tasks || []).map((task: Task) => ({
        id: task.id,
        title: task.title,
        type: 'task' as const,
        startDate: new Date(task.dueDate),
        endDate: new Date(task.dueDate),
        assignee: task.assignee,
        description: task.description,
        color:
          task.priority === 'high'
            ? '#EF4444'
            : task.priority === 'medium'
              ? '#F59E0B'
              : '#10B981',
      }));

      return {
        success: true,
        data: events,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Kunlik eventlarni olish
   */
  static async getDayEvents(
    date: Date,
    assignee?: string
  ): Promise<ApiResponse<CalendarEvent[]>> {
    const start = startOfDay(date);
    const end = endOfDay(date);
    return this.getEvents(start, end, assignee);
  }

  /**
   * Haftalik eventlarni olish
   */
  static async getWeekEvents(
    date: Date,
    assignee?: string
  ): Promise<ApiResponse<CalendarEvent[]>> {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Dushanbadan boshlanadi
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return this.getEvents(start, end, assignee);
  }

  /**
   * Oylik eventlarni olish
   */
  static async getMonthEvents(
    date: Date,
    assignee?: string
  ): Promise<ApiResponse<CalendarEvent[]>> {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return this.getEvents(start, end, assignee);
  }

  /**
   * Event yaratish
   */
  static async createEvent(
    event: Omit<CalendarEvent, 'id'>
  ): Promise<ApiResponse<CalendarEvent>> {
    try {
      // Agar task bo'lsa, tasks jadvaliga qo'shish
      if (event.type === 'task') {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: event.title,
            description: event.description,
            assignee: event.assignee,
            due_date: event.startDate.toISOString(),
            status: 'pending',
            priority: 'medium',
          })
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Event yaratishda xatolik: ${error.message}`,
          };
        }

        const calendarEvent: CalendarEvent = {
          id: data.id,
          title: event.title,
          type: 'task',
          startDate: new Date(data.due_date),
          endDate: event.endDate,
          assignee: event.assignee,
          description: event.description,
        };

        return {
          success: true,
          data: calendarEvent,
        };
      }

      // Boshqa event turlari uchun (meeting, deadline)
      // Hozircha faqat task'lar qo'llab-quvvatlanadi
      return {
        success: false,
        error: "Bu event turi hozircha qo'llab-quvvatlanmaydi",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Event'ni yangilash
   */
  static async updateEvent(
    eventId: string,
    updates: Partial<CalendarEvent>
  ): Promise<ApiResponse<CalendarEvent>> {
    try {
      if (updates.type === 'task' || !updates.type) {
        const updateData: Record<string, unknown> = {};
        if (updates.title) updateData.title = updates.title;
        if (updates.description) updateData.description = updates.description;
        if (updates.assignee) updateData.assignee = updates.assignee;
        if (updates.startDate)
          updateData.due_date = updates.startDate.toISOString();

        const { data, error } = await supabase
          .from('tasks')
          .update(updateData)
          .eq('id', eventId)
          .select()
          .single();

        if (error) {
          return {
            success: false,
            error: `Event yangilashda xatolik: ${error.message}`,
          };
        }

        const calendarEvent: CalendarEvent = {
          id: data.id,
          title: data.title,
          type: 'task',
          startDate: new Date(data.due_date),
          endDate: updates.endDate,
          assignee: data.assignee,
          description: data.description,
        };

        return {
          success: true,
          data: calendarEvent,
        };
      }

      return {
        success: false,
        error: "Bu event turi yangilash qo'llab-quvvatlanmaydi",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Event'ni o'chirish
   */
  static async deleteEvent(
    eventId: string,
    eventType: CalendarEvent['type']
  ): Promise<ApiResponse<void>> {
    try {
      if (eventType === 'task') {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', eventId);

        if (error) {
          return {
            success: false,
            error: `Event o'chirishda xatolik: ${error.message}`,
          };
        }

        return {
          success: true,
          message: "Event o'chirildi",
        };
      }

      return {
        success: false,
        error: "Bu event turi o'chirish qo'llab-quvvatlanmaydi",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Muddatlarni olish
   */
  static async getDeadlines(
    assignee?: string
  ): Promise<ApiResponse<Deadline[]>> {
    try {
      let query = supabase
        .from('tasks')
        .select('id, title, due_date, assignee, status')
        .not('due_date', 'is', null);

      if (assignee) {
        query = query.eq('assignee', assignee);
      }

      const { data: tasks, error } = await query;

      if (error) {
        return {
          success: false,
          error: `Muddatlarni olishda xatolik: ${error.message}`,
        };
      }

      const now = new Date();
      const deadlines: Deadline[] = (tasks || []).map(
        (task: {
          id: string;
          title: string;
          due_date: string;
          assignee: string;
          status: string;
        }) => {
          const dueDate = new Date(task.due_date);
          let status: Deadline['status'] = 'upcoming';

          if (task.status === 'completed') {
            status = 'completed';
          } else if (dueDate < now) {
            status = 'overdue';
          }

          return {
            id: task.id,
            taskId: task.id,
            title: task.title,
            dueDate,
            status,
            reminderSent: false,
            assignee: task.assignee,
          };
        }
      );

      return {
        success: true,
        data: deadlines,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Muddatni yangilash
   */
  static async updateDeadline(
    deadlineId: string,
    updates: Partial<Deadline>
  ): Promise<ApiResponse<Deadline>> {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.dueDate) {
        updateData.due_date = updates.dueDate.toISOString();
      }
      if (updates.title) {
        updateData.title = updates.title;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', deadlineId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `Muddat yangilashda xatolik: ${error.message}`,
        };
      }

      const now = new Date();
      const dueDate = new Date(data.due_date);
      let status: Deadline['status'] = 'upcoming';

      if (data.status === 'completed') {
        status = 'completed';
      } else if (dueDate < now) {
        status = 'overdue';
      }

      const deadline: Deadline = {
        id: data.id,
        taskId: data.id,
        title: data.title,
        dueDate,
        status,
        reminderSent: updates.reminderSent ?? false,
        assignee: data.assignee,
      };

      return {
        success: true,
        data: deadline,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }

  /**
   * Kelgusi muddatlarni olish
   */
  static async getUpcomingDeadlines(
    days: number = 7,
    assignee?: string
  ): Promise<ApiResponse<Deadline[]>> {
    try {
      const result = await this.getDeadlines(assignee);
      if (!result.success || !result.data) {
        return result;
      }

      const now = new Date();
      const futureDate = addDays(now, days);

      const upcoming = result.data.filter(deadline => {
        return (
          deadline.status === 'upcoming' &&
          deadline.dueDate >= now &&
          deadline.dueDate <= futureDate
        );
      });

      return {
        success: true,
        data: upcoming,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      };
    }
  }
}
