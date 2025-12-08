import { useEffect, useRef, useState } from 'react';

import { logger } from '../utils/logger';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

/**
 * Real-time subscription holati
 */
interface RealtimeState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

/**
 * useRealtime hook - Supabase real-time subscription uchun
 *
 * Bu hook Supabase jadvallariga real-time subscription yaratadi va
 * o'zgarishlarni avtomatik kuzatadi.
 *
 * @template T - Ma'lumot turi
 * @param table - Jadval nomi
 * @param options - Subscription sozlamalari
 * @returns Real-time state va cleanup funksiyasi
 *
 * @example
 * ```tsx
 * const { data, loading, error, connected } = useRealtime<Task[]>('tasks', {
 *   filter: 'status=eq.pending',
 *   onInsert: (newTask) => console.log('Yangi vazifa:', newTask),
 *   onUpdate: (updatedTask) => console.log('Yangilangan vazifa:', updatedTask),
 *   onDelete: (deletedTask) => console.log('O\'chirilgan vazifa:', deletedTask)
 * });
 * ```
 */
export function useRealtime<T = unknown>(
  table: string,
  options: {
    /** Jadvaldan ma'lumotlarni olish uchun filter */
    filter?: string;
    /** INSERT event handler */
    onInsert?: (data: T) => void;
    /** UPDATE event handler */
    onUpdate?: (data: T) => void;
    /** DELETE event handler */
    onDelete?: (data: T) => void;
    /** Barcha eventlar uchun umumiy handler */
    onChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', data: T) => void;
    /** Subscription'ni yoqish/o'chirish */
    enabled?: boolean;
  } = {}
) {
  const {
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onChange,
    enabled = true,
  } = options;

  const [state, setState] = useState<RealtimeState<T>>({
    data: null,
    loading: true,
    error: null,
    connected: false,
  });

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Agar Supabase sozlanmagan yoki disabled bo'lsa
    if (!isSupabaseConfigured() || !enabled) {
      setState({
        data: null,
        loading: false,
        error: null,
        connected: false,
      });
      return;
    }

    // Avvalgi subscription'ni to'xtatish
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Channel yaratish
      const channelName = `realtime:${table}${filter ? `:${filter}` : ''}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: filter || undefined,
          },
          payload => {
            const eventType = payload.eventType as
              | 'INSERT'
              | 'UPDATE'
              | 'DELETE';
            const newData = payload.new as T;
            const oldData = payload.old as T;

            // Event handler'larni chaqirish
            if (eventType === 'INSERT' && newData) {
              onInsert?.(newData);
              onChange?.(eventType, newData);
            } else if (eventType === 'UPDATE' && newData) {
              onUpdate?.(newData);
              onChange?.(eventType, newData);
            } else if (eventType === 'DELETE' && oldData) {
              onDelete?.(oldData);
              onChange?.(eventType, oldData);
            }

            // State'ni yangilash
            if (eventType === 'INSERT' || eventType === 'UPDATE') {
              setState(prev => ({
                ...prev,
                data: newData,
                loading: false,
                connected: true,
              }));
            } else if (eventType === 'DELETE') {
              setState(prev => ({
                ...prev,
                data: null,
                loading: false,
                connected: true,
              }));
            }
          }
        )
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            setState(prev => ({
              ...prev,
              connected: true,
              loading: false,
              error: null,
            }));
            logger.info(`✅ Real-time subscription yaratildi: ${table}`);
          } else if (status === 'CHANNEL_ERROR') {
            setState(prev => ({
              ...prev,
              connected: false,
              loading: false,
              error: 'Real-time subscription xatosi',
            }));
            logger.error(`❌ Real-time subscription xatosi: ${table}`);
          } else if (status === 'TIMED_OUT') {
            setState(prev => ({
              ...prev,
              connected: false,
              loading: false,
              error: 'Real-time subscription vaqti tugadi',
            }));
            logger.warn(`⏱️ Real-time subscription vaqti tugadi: ${table}`);
          }
        });

      channelRef.current = channel;

      // Cleanup funksiyasi
      cleanupRef.current = () => {
        try {
          if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }
        } catch (error) {
          logger.warn(
            'Channel cleanup xatosi',
            error instanceof Error ? error : new Error(String(error))
          );
        }
      };
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Real-time subscription yaratishda xatolik',
        connected: false,
      });
      logger.error(
        'Real-time subscription yaratishda xatolik',
        error instanceof Error ? error : new Error(String(error))
      );
    }

    // Cleanup
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [table, filter, enabled, onInsert, onUpdate, onDelete, onChange]);

  return {
    ...state,
    /**
     * Subscription'ni qo'lda to'xtatish
     */
    unsubscribe: () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    },
  };
}

/**
 * useRealtimeList hook - Jadval ro'yxatini real-time kuzatish
 *
 * Bu hook jadvaldagi barcha yozuvlarni real-time kuzatadi va
 * o'zgarishlarni avtomatik yangilaydi.
 *
 * @template T - Ma'lumot turi
 * @param table - Jadval nomi
 * @param options - Subscription sozlamalari
 * @returns Real-time state
 *
 * @example
 * ```tsx
 * const { data, loading, error, connected } = useRealtimeList<Task[]>('tasks', {
 *   filter: 'status=eq.pending',
 *   orderBy: 'created_at',
 *   orderAscending: false
 * });
 * ```
 */
export function useRealtimeList<T = unknown>(
  table: string,
  options: {
    /** Jadvaldan ma'lumotlarni olish uchun filter */
    filter?: string;
    /** Tartiblash ustuni */
    orderBy?: string;
    /** O'sish tartibi (true = ascending, false = descending) */
    orderAscending?: boolean;
    /** Subscription'ni yoqish/o'chirish */
    enabled?: boolean;
  } = {}
) {
  const { filter, orderBy, orderAscending = false, enabled = true } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Dastlabki ma'lumotlarni yuklash
  useEffect(() => {
    if (!isSupabaseConfigured() || !enabled) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(table).select('*');

        if (filter) {
          // Filter'ni parse qilish (oddiy format: "column=eq.value")
          const [column, operator, value] = filter.split(/[=<>]/);
          if (operator === 'eq') {
            query = query.eq(column, value);
          }
        }

        if (orderBy) {
          query = query.order(orderBy, { ascending: orderAscending });
        }

        const { data: result, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        setData((result as T[]) || []);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik"
        );
        logger.error(
          "Ma'lumotlarni yuklashda xatolik",
          err instanceof Error ? err : new Error(String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [table, filter, orderBy, orderAscending, enabled]);

  // Real-time subscription
  const { connected: rtConnected } = useRealtime<T>(table, {
    filter,
    enabled,
    onInsert: newItem => {
      setData(prev => {
        // Duplicate tekshirish
        const exists = prev.some(
          item =>
            (item as Record<string, unknown>).id ===
            (newItem as Record<string, unknown>).id
        );
        if (exists) return prev;

        const newData = [newItem, ...prev];
        // OrderBy bo'lsa, tartiblash
        if (orderBy) {
          newData.sort((a, b) => {
            const aVal = String((a as Record<string, unknown>)[orderBy] ?? '');
            const bVal = String((b as Record<string, unknown>)[orderBy] ?? '');
            if (orderAscending) {
              return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
          });
        }
        return newData;
      });
    },
    onUpdate: updatedItem => {
      setData(prev =>
        prev.map(item =>
          (item as Record<string, unknown>).id ===
          (updatedItem as Record<string, unknown>).id
            ? updatedItem
            : item
        )
      );
    },
    onDelete: deletedItem => {
      setData(prev =>
        prev.filter(
          item =>
            (item as Record<string, unknown>).id !==
            (deletedItem as Record<string, unknown>).id
        )
      );
    },
  });

  useEffect(() => {
    setConnected(rtConnected);
  }, [rtConnected]);

  return {
    data,
    loading,
    error,
    connected,
  };
}
