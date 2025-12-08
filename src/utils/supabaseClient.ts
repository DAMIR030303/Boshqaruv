import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { logger } from './logger';

// Placeholder qiymatlari
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder';

// Supabase konfiguratsiyasi - environment variable'lardan o'qish
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PLACEHOLDER_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

/**
 * Supabase konfiguratsiya holatini tekshirish
 * @returns true agar Supabase to'g'ri sozlangan bo'lsa
 */
export const isSupabaseConfigured = (): boolean => {
  const isConfigured =
    supabaseUrl !== PLACEHOLDER_URL &&
    supabaseAnonKey !== PLACEHOLDER_KEY &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co');

  return isConfigured;
};

// Development mode'da ogohlantirish ko'rsatish
if (!isSupabaseConfigured()) {
  logger.warn(
    '⚠️ Supabase sozlanmagan!\n' +
      "Ma'lumotlar bazasidan foydalanish uchun quyidagi sozlamalarni amalga oshiring:\n" +
      '1. https://supabase.com dan loyiha yarating\n' +
      "2. .env faylini yarating va quyidagi qiymatlarni o'rnating:\n" +
      '   VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
      '   VITE_SUPABASE_ANON_KEY=your-anon-key\n' +
      "\nHozircha demo ma'lumotlar ishlatiladi."
  );
}

/**
 * Supabase client - ma'lumotlar bazasi bilan ishlash uchun
 * Real-time rejim yoqilgan
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: isSupabaseConfigured(),
      autoRefreshToken: isSupabaseConfigured(),
    },
    // Real-time sozlamalari
    realtime: {
      params: {
        eventsPerSecond: isSupabaseConfigured() ? 10 : 0,
      },
    },
    // Global sozlamalar
    global: {
      headers: {
        'x-client-info': 'boshqaruv-app@1.0.0',
      },
    },
  }
);

/**
 * Supabase bilan xavfsiz so'rov yuborish
 * @param operation - Bajarilishi kerak bo'lgan operatsiya
 * @returns Operatsiya natijasi yoki null (agar Supabase sozlanmagan bo'lsa)
 */
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  if (!isSupabaseConfigured()) {
    logger.info("ℹ️ Supabase sozlanmagan - demo ma'lumotlar qaytarilmoqda");
    return null;
  }

  try {
    return await operation();
  } catch (error) {
    logger.error(
      'Supabase xatosi',
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
}
