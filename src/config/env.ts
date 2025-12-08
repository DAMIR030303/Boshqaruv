/**
 * Environment Variables Validation
 *
 * Bu fayl environment variable'larni Zod bilan validate qiladi va
 * runtime'da noto'g'ri sozlangan variable'larni aniqlaydi.
 *
 * Dastur ishga tushganda avtomatik tekshiriladi.
 */

import { z } from 'zod';

import { logger } from '../utils/logger';

/**
 * Environment variable schema
 *
 * Bu schema barcha kerakli environment variable'larni
 * va ularning tiplarini belgilaydi.
 */
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z
    .string()
    .url('VITE_SUPABASE_URL must be a valid URL')
    .optional()
    .default('https://placeholder.supabase.co'),

  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'VITE_SUPABASE_ANON_KEY cannot be empty')
    .optional()
    .default('placeholder-key'),

  // Application Configuration
  VITE_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .optional()
    .default('development'),

  VITE_APP_TITLE: z
    .string()
    .min(1, 'VITE_APP_TITLE cannot be empty')
    .optional()
    .default('Boshqaruv'),

  // JWT Secret
  VITE_JWT_SECRET: z
    .string()
    .min(32, 'VITE_JWT_SECRET must be at least 32 characters long')
    .optional()
    .default('change-this-in-production-minimum-32-characters-long-secret-key'),

  // API Configuration
  VITE_API_URL: z
    .string()
    .url('VITE_API_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000'),

  // Optional: Analytics & Monitoring
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_GA_ID: z.string().optional(),
});

/**
 * Environment variables type
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 *
 * Bu obyekt barcha validated environment variable'larni o'z ichiga oladi.
 * Agar validation muvaffaqiyatsiz bo'lsa, xato ko'rsatiladi.
 */
let validatedEnv: Env | null = null;

/**
 * Environment variable'larni validate qilish
 *
 * @returns Validated environment variables
 * @throws Error agar validation muvaffaqiyatsiz bo'lsa
 */
export function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    // Import.meta.env dan o'qish
    const rawEnv = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_APP_ENV:
        import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development',
      VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
      VITE_JWT_SECRET: import.meta.env.VITE_JWT_SECRET,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
      VITE_GA_ID: import.meta.env.VITE_GA_ID,
    };

    validatedEnv = envSchema.parse(rawEnv);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map(err => {
          return `${err.path.join('.')}: ${err.message}`;
        })
        .join('\n');

      const errorMessage = `Environment variable validation failed:\n${errorMessages}\n\nPlease check your .env file and ensure all required variables are set correctly.`;

      // Development'da logger orqali chiqarish
      if (import.meta.env.DEV) {
        logger.error(errorMessage);
        logger.warn('Using default values. Please fix your .env file.');
      }

      // Production'da xato ko'rsatish
      throw new Error(errorMessage);
    }

    throw error;
  }
}

/**
 * Environment variable'ni olish
 *
 * @param key - Environment variable kaliti
 * @returns Environment variable qiymati
 */
export function getEnv(key: keyof Env): string | undefined {
  const env = validateEnv();
  return env[key];
}

/**
 * Is development mode?
 */
export function isDevelopment(): boolean {
  return getEnv('VITE_APP_ENV') === 'development' || import.meta.env.DEV;
}

/**
 * Is production mode?
 */
export function isProduction(): boolean {
  return getEnv('VITE_APP_ENV') === 'production' && !import.meta.env.DEV;
}

/**
 * Supabase sozlanganmi?
 */
export function isSupabaseConfigured(): boolean {
  const url = getEnv('VITE_SUPABASE_URL');
  const key = getEnv('VITE_SUPABASE_ANON_KEY');

  return (
    !!url &&
    !!key &&
    url !== 'https://placeholder.supabase.co' &&
    key !== 'placeholder-key' &&
    !url.includes('placeholder') &&
    !key.includes('placeholder') &&
    url.startsWith('https://') &&
    url.includes('.supabase.co')
  );
}

// Dastur ishga tushganda avtomatik validate qilish
if (typeof window !== 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    // Development'da xato ko'rsatish, production'da silent fail
    if (isDevelopment()) {
      console.error('Environment validation error:', error);
    }
  }
}

// Export validated env as default
export const env = validateEnv();
