import { useCallback, useEffect, useState } from 'react';

import { toast } from 'sonner';

import { CalendarService } from '../services/calendarService';
import type { CalendarEvent, Deadline } from '../types';

interface UseCalendarOptions {
  /** Foydalanuvchi nomi (filter uchun) */
  assignee?: string;
  /** Boshlang'ich sana */
  initialDate?: Date;
}

/**
 * Kalendar hook - Kontur.Extern uslubida
 * Kalendar eventlari va muddatlar boshqaruvi
 */
export function useCalendar(options: UseCalendarOptions = {}) {
  const { assignee, initialDate = new Date() } = options;
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  // Eventlarni yuklash
  const loadEvents = useCallback(
    async (date: Date) => {
      setIsLoading(true);
      try {
        let result;
        switch (view) {
          case 'day':
            result = await CalendarService.getDayEvents(date, assignee);
            break;
          case 'week':
            result = await CalendarService.getWeekEvents(date, assignee);
            break;
          case 'month':
            result = await CalendarService.getMonthEvents(date, assignee);
            break;
          default:
            result = await CalendarService.getMonthEvents(date, assignee);
        }

        if (result.success && result.data) {
          setEvents(result.data);
        } else {
          toast.error(result.error || 'Eventlarni yuklashda xatolik');
        }
      } catch (error) {
        toast.error('Eventlarni yuklashda xatolik');
      } finally {
        setIsLoading(false);
      }
    },
    [view, assignee]
  );

  // Muddatlarni yuklash
  const loadDeadlines = useCallback(async () => {
    try {
      const result = await CalendarService.getDeadlines(assignee);
      if (result.success && result.data) {
        setDeadlines(result.data);
      } else {
        toast.error(result.error || 'Muddatlarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Muddatlarni yuklashda xatolik');
    }
  }, [assignee]);

  // Event yaratish
  const createEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const result = await CalendarService.createEvent(event);
      if (result.success && result.data) {
        setEvents(prev => [...prev, result.data!]);
        toast.success('Event yaratildi');
        return result.data;
      } else {
        toast.error(result.error || 'Event yaratishda xatolik');
        return null;
      }
    } catch (error) {
      toast.error('Event yaratishda xatolik');
      return null;
    }
  }, []);

  // Event yangilash
  const updateEvent = useCallback(
    async (eventId: string, updates: Partial<CalendarEvent>) => {
      try {
        const result = await CalendarService.updateEvent(eventId, updates);
        if (result.success && result.data) {
          setEvents(prev =>
            prev.map(e => (e.id === eventId ? result.data! : e))
          );
          toast.success('Event yangilandi');
          return result.data;
        } else {
          toast.error(result.error || 'Event yangilashda xatolik');
          return null;
        }
      } catch (error) {
        toast.error('Event yangilashda xatolik');
        return null;
      }
    },
    []
  );

  // Event o'chirish
  const deleteEvent = useCallback(
    async (eventId: string, eventType: CalendarEvent['type']) => {
      try {
        const result = await CalendarService.deleteEvent(eventId, eventType);
        if (result.success) {
          setEvents(prev => prev.filter(e => e.id !== eventId));
          toast.success("Event o'chirildi");
          return true;
        } else {
          toast.error(result.error || "Event o'chirishda xatolik");
          return false;
        }
      } catch (error) {
        toast.error("Event o'chirishda xatolik");
        return false;
      }
    },
    []
  );

  // Muddat yangilash
  const updateDeadline = useCallback(
    async (deadlineId: string, updates: Partial<Deadline>) => {
      try {
        const result = await CalendarService.updateDeadline(
          deadlineId,
          updates
        );
        if (result.success && result.data) {
          setDeadlines(prev =>
            prev.map(d => (d.id === deadlineId ? result.data! : d))
          );
          toast.success('Muddat yangilandi');
          return result.data;
        } else {
          toast.error(result.error || 'Muddat yangilashda xatolik');
          return null;
        }
      } catch (error) {
        toast.error('Muddat yangilashda xatolik');
        return null;
      }
    },
    []
  );

  // Sana o'zgartirish
  const changeDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // View o'zgartirish
  const changeView = useCallback((newView: 'day' | 'week' | 'month') => {
    setView(newView);
  }, []);

  // Oldingi davr
  const goToPrevious = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, view]);

  // Keyingi davr
  const goToNext = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, view]);

  // Bugungi kunga o'tish
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Effect: Eventlarni yuklash
  useEffect(() => {
    loadEvents(currentDate);
  }, [currentDate, loadEvents]);

  // Effect: Muddatlarni yuklash
  useEffect(() => {
    loadDeadlines();
  }, [loadDeadlines]);

  return {
    // State
    currentDate,
    events,
    deadlines,
    isLoading,
    view,

    // Actions
    createEvent,
    updateEvent,
    deleteEvent,
    updateDeadline,
    changeDate,
    changeView,
    goToPrevious,
    goToNext,
    goToToday,
    refresh: () => {
      loadEvents(currentDate);
      loadDeadlines();
    },
  };
}
