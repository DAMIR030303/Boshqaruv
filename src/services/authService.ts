import type { LoginCredentials, UserProfile } from '../types';
import {
  generateToken,
  hashPassword,
  verifyPassword,
  verifyToken,
} from '../utils/crypto';
import { safeLocalStorage } from '../utils/storage';

/**
 * Xavfsiz foydalanuvchi ma'lumotlar bazasi
 *
 * Production'da bu ma'lumotlar real database'da saqlanadi.
 * Hozircha development uchun in-memory database ishlatilmoqda.
 *
 * Har bir foydalanuvchi uchun:
 * - passwordHash: bcrypt bilan hash qilingan parol
 * - profile: Foydalanuvchi profil ma'lumotlari
 * - permissions: Foydalanuvchi ruxsatlari
 */
const SECURE_USER_DB = {
  admin: {
    passwordHash: '$2a$10$YourHashedPasswordHere', // Will be generated on first run
    profile: {
      name: 'Alisher Fayzullayev',
      role: 'Administrator' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'admin@boshqaruv.uz',
      permissions: ['all'],
    },
  },
  manager: {
    passwordHash: '$2a$10$YourHashedPasswordHere',
    profile: {
      name: 'Nargiza Karimova',
      role: 'Manager' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'manager@boshqaruv.uz',
      permissions: ['read', 'write', 'manage_employees'],
    },
  },
  user: {
    passwordHash: '$2a$10$YourHashedPasswordHere',
    profile: {
      name: 'Javohir Tursunov',
      role: 'Xodim' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'user@boshqaruv.uz',
      permissions: ['read', 'write_own'],
    },
  },
  marketolog: {
    passwordHash: '$2a$10$YourHashedPasswordHere',
    profile: {
      name: "Shaxriddin Adizov Sherali o'g'li",
      role: 'Marketing boshqaruvchisi' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'marketing@boshqaruv.uz',
      permissions: ['read', 'write', 'manage_marketing'],
    },
  },
};

/**
 * Session storage kalitlari
 *
 * Bu constant'lar session ma'lumotlarini localStorage'da
 * saqlash uchun kalit nomlarini belgilaydi.
 */
const SESSION_KEYS = {
  TOKEN: 'boshqaruv-session-token',
  REFRESH_TOKEN: 'boshqaruv-refresh-token',
  USER: 'boshqaruv-user-profile',
  EXPIRES_AT: 'boshqaruv-session-expires',
};

/**
 * Rate limiting konfiguratsiyasi
 *
 * Bu constant'lar login urinishlarini cheklash uchun
 * ishlatiladi. Juda ko'p muvaffaqiyatsiz urinishlardan
 * keyin foydalanuvchi vaqtincha bloklanadi.
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
/** Maksimal ruxsat etilgan login urinishlari soni */
const MAX_LOGIN_ATTEMPTS = 5;
/** Bloklash muddati (millisekundlarda) - 15 daqiqa */
const LOCKOUT_DURATION = 15 * 60 * 1000;

/**
 * Check if user is locked out due to too many failed attempts
 */
const isLockedOut = (username: string): boolean => {
  const attempts = loginAttempts.get(username);
  if (!attempts) return false;

  const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

  if (timeSinceLastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(username);
    return false;
  }

  return attempts.count >= MAX_LOGIN_ATTEMPTS;
};

/**
 * Record failed login attempt
 */
const recordFailedAttempt = (username: string): void => {
  const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(username, attempts);
};

/**
 * Clear login attempts for successful login
 */
const clearLoginAttempts = (username: string): void => {
  loginAttempts.delete(username);
};

/**
 * Secure login with JWT
 */
export const login = async (
  credentials: LoginCredentials
): Promise<{
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserProfile;
  error?: string;
}> => {
  try {
    const { username, password } = credentials;

    // Check rate limiting
    if (isLockedOut(username)) {
      return {
        success: false,
        error:
          "Juda ko'p muvaffaqiyatsiz urinishlar. 15 daqiqadan so'ng qayta urinib ko'ring.",
      };
    }

    // Validate user exists
    const userRecord = SECURE_USER_DB[username as keyof typeof SECURE_USER_DB];
    if (!userRecord) {
      recordFailedAttempt(username);
      return {
        success: false,
        error: "Noto'g'ri foydalanuvchi nomi yoki parol",
      };
    }

    // Demo passwords - always enabled for demo purposes
    // In production, you can disable this and use hashed passwords
    const demoPasswords: Record<string, string> = {
      admin: 'admin123',
      manager: 'manager123',
      user: 'user123',
      marketolog: 'marketing123',
    };

    // Check demo password (case-insensitive username check)
    const normalizedUsername = username.toLowerCase().trim();
    let isValidPassword = password === demoPasswords[normalizedUsername];

    // Also check original username (in case of case mismatch)
    if (!isValidPassword) {
      isValidPassword = password === demoPasswords[username];
    }

    // If demo password doesn't match and passwordHash is set, try hash verification
    if (
      !isValidPassword &&
      userRecord.passwordHash &&
      userRecord.passwordHash !== '$2a$10$YourHashedPasswordHere'
    ) {
      try {
        isValidPassword = await verifyPassword(
          password,
          userRecord.passwordHash
        );
      } catch {
        // If hash verification fails, keep demo password result
        isValidPassword = false;
      }
    }

    if (!isValidPassword) {
      recordFailedAttempt(username);
      return {
        success: false,
        error: "Noto'g'ri foydalanuvchi nomi yoki parol",
      };
    }

    // Clear failed attempts on successful login
    clearLoginAttempts(username);

    // Generate tokens with error handling
    const tokenPayload = {
      username,
      role: userRecord.profile.role,
      permissions: userRecord.profile.permissions,
    };

    let token: string;
    let refreshToken: string;

    try {
      token = await generateToken(tokenPayload, '1h');
      refreshToken = await generateToken(tokenPayload, '7d');
    } catch (tokenError) {
      console.error('[Auth] Token generation failed:', tokenError);
      // Even if token generation fails, allow login (for demo purposes)
      // Generate simple token as fallback
      const simpleToken = btoa(
        JSON.stringify({ ...tokenPayload, exp: Date.now() + 3600000 })
      );
      token = simpleToken;
      refreshToken = simpleToken;
    }

    // Store session
    try {
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
      safeLocalStorage.setItem(SESSION_KEYS.TOKEN, token);
      safeLocalStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken);
      safeLocalStorage.setItem(SESSION_KEYS.USER, userRecord.profile);
      safeLocalStorage.setItem(SESSION_KEYS.EXPIRES_AT, expiresAt);
    } catch (storageError) {
      console.error('[Auth] Storage failed:', storageError);
      // Continue even if storage fails
    }

    return {
      success: true,
      token,
      refreshToken,
      user: userRecord.profile,
    };
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login xatosi yuz berdi',
    };
  }
};

/**
 * Logout and clear session
 */
export const logout = async (): Promise<void> => {
  Object.values(SESSION_KEYS).forEach(key => {
    safeLocalStorage.removeItem(key);
  });
};

/**
 * Get current session
 */
export const getSession = async (): Promise<{
  isValid: boolean;
  user?: UserProfile;
  token?: string;
}> => {
  try {
    const token = safeLocalStorage.getItem(SESSION_KEYS.TOKEN, null);
    const user = safeLocalStorage.getItem(SESSION_KEYS.USER, null);
    const expiresAt = safeLocalStorage.getItem(SESSION_KEYS.EXPIRES_AT, 0);

    if (!token || !user) {
      return { isValid: false };
    }

    // Check if session expired
    if (expiresAt && Date.now() > expiresAt) {
      // Try to refresh token
      const refreshToken = safeLocalStorage.getItem(
        SESSION_KEYS.REFRESH_TOKEN,
        null
      );
      if (refreshToken) {
        try {
          const decoded = await verifyToken<{
            username: string;
            role: string;
            permissions: string[];
          }>(refreshToken);
          const newToken = await generateToken(
            {
              username: decoded.username,
              role: decoded.role,
              permissions: decoded.permissions,
            },
            '1h'
          );

          const newExpiresAt = Date.now() + 60 * 60 * 1000;
          safeLocalStorage.setItem(SESSION_KEYS.TOKEN, newToken);
          safeLocalStorage.setItem(SESSION_KEYS.EXPIRES_AT, newExpiresAt);

          return {
            isValid: true,
            user,
            token: newToken,
          };
        } catch {
          await logout();
          return { isValid: false };
        }
      }

      await logout();
      return { isValid: false };
    }

    // Verify token is still valid
    try {
      await verifyToken(token);
      return {
        isValid: true,
        user,
        token,
      };
    } catch {
      await logout();
      return { isValid: false };
    }
  } catch {
    return { isValid: false };
  }
};

/**
 * Check if user has permission
 */
export const hasPermission = async (permission: string): Promise<boolean> => {
  const session = await getSession();
  if (!session.isValid || !session.user) return false;

  const userRecord = Object.values(SECURE_USER_DB).find(
    record => record.profile.name === session.user!.name
  );

  if (!userRecord) return false;

  return (
    userRecord.profile.permissions.includes('all') ||
    userRecord.profile.permissions.includes(permission)
  );
};

/**
 * Initialize password hashes (for demo purposes)
 */
export const initializePasswords = async (): Promise<void> => {
  if (import.meta.env.VITE_APP_ENV !== 'development') return;

  // This would be done during user registration in production
  const passwords = {
    admin: 'admin123',
    manager: 'manager123',
    user: 'user123',
    marketolog: 'marketing123',
  };

  for (const [, password] of Object.entries(passwords)) {
    await hashPassword(password);
    // In production, save to database
    // For demo, we're using the hardcoded hashes
  }
};
