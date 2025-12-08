import { logger } from './logger';
import { isSupabaseConfigured, supabase } from './supabaseClient';

/**
 * Realtime table nomlari
 */
export type RealtimeTable =
  | 'kpi'
  | 'tasks'
  | 'attendance'
  | 'shifts'
  | 'penalties'
  | 'reports';

/**
 * Supabase Realtime payload struktura
 */
interface RealtimePayload {
  new?: unknown;
  old?: unknown;
  eventType?: string;
}

/**
 * Supabase jadvallariga realtime subscription yaratadi
 *
 * Bu funksiya bir nechta jadvallarga bir vaqtning o'zida
 * realtime subscription yaratadi va o'zgarishlarni kuzatadi.
 * Agar Supabase to'g'ri konfiguratsiya qilinmagan bo'lsa,
 * subscription yaratilmaydi va no-op cleanup funksiyasi qaytariladi.
 *
 * @param tables - Kuzatiladigan jadvallar ro'yxati
 * @param onChange - O'zgarishlar bo'lganda chaqiriladigan callback
 * @returns Cleanup funksiyasi (subscription'ni to'xtatish uchun)
 */
export function subscribeToTables(
  tables: RealtimeTable[],
  onChange: (payload: unknown) => void
): () => void {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'realtime.ts:30',
      message: 'subscribeToTables called',
      data: { tableCount: tables.length, isConfigured: isSupabaseConfigured() },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'D',
    }),
  }).catch(() => {});
  // #endregion agent log
  // Agar Supabase to'g'ri konfiguratsiya qilinmagan bo'lsa, realtime'ni o'chirish
  if (!isSupabaseConfigured()) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'realtime.ts:35',
        message: 'Supabase not configured - skipping subscription',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion agent log
    // No-op cleanup function
    return () => {
      // Do nothing
    };
  }

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'realtime.ts:44',
        message: 'Creating Supabase channel',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion agent log
    // Unique channel name yaratish
    const channelName = `realtime:app:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const channel = supabase.channel(channelName);

    tables.forEach(table => {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'realtime.ts:47',
            message: 'Subscribing to table',
            data: { table },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'D',
          }),
        }
      ).catch(() => {});
      // #endregion agent log
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        payload => {
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'realtime.ts:52',
                message: 'Realtime event received',
                data: {
                  table,
                  eventType: (payload as RealtimePayload)?.eventType,
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'post-fix',
                hypothesisId: 'D',
              }),
            }
          ).catch(() => {});
          // #endregion agent log
          // Type guard for payload structure
          const typedPayload = payload as RealtimePayload;
          const next = typedPayload?.new;
          onChange(next ?? payload);
        }
      );
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'realtime.ts:60',
        message: 'Subscribing channel',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion agent log
    channel.subscribe(status => {
      if (status === 'SUBSCRIBED') {
        logger.info('✅ Supabase realtime subscription muvaffaqiyatli');
      } else if (
        status === 'CHANNEL_ERROR' ||
        status === 'TIMED_OUT' ||
        status === 'CLOSED'
      ) {
        // Faqat development'da log qilish
        if (import.meta.env.DEV && status !== 'CLOSED') {
          logger.warn('❌ Supabase realtime subscription xatosi:', status);
        }
      }
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'realtime.ts:62',
        message: 'Realtime subscription setup complete',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion agent log
    return () => {
      try {
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'realtime.ts:65',
              message: 'Cleaning up realtime channel',
              data: {},
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'F',
            }),
          }
        ).catch(() => {});
        // #endregion agent log
        // Avval unsubscribe, keyin remove
        channel.unsubscribe();
        supabase.removeChannel(channel);
      } catch (error) {
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'realtime.ts:68',
              message: 'Error during channel cleanup',
              data: {
                error: error instanceof Error ? error.message : String(error),
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'F',
            }),
          }
        ).catch(() => {});
        // #endregion agent log
        // Silently handle cleanup errors
        if (import.meta.env.DEV) {
          logger.warn(
            'Error removing Supabase channel',
            error instanceof Error ? error : new Error(String(error))
          );
        }
      }
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'realtime.ts:74',
        message: 'Realtime subscription creation failed',
        data: { error: error instanceof Error ? error.message : String(error) },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion agent log
    // If subscription fails, return no-op cleanup
    if (import.meta.env.DEV) {
      logger.warn(
        'Failed to subscribe to Supabase realtime',
        error instanceof Error ? error : new Error(String(error))
      );
    }
    return () => {
      // Do nothing
    };
  }
}
