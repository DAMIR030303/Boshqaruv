import { generateToken, verifyToken, hashPassword, verifyPassword } from '../utils/crypto';
import { safeLocalStorage } from '../utils/storage';
import type { UserProfile, LoginCredentials } from '../types';

// Secure user database (in production, this would be in a real database)
const SECURE_USER_DB = {
  admin: {
    passwordHash: '$2a$10$YourHashedPasswordHere', // Will be generated on first run
    profile: {
      name: 'Alisher Fayzullayev',
      role: 'Administrator' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'admin@boshqaruv.uz',
      permissions: ['all']
    }
  },
  manager: {
    passwordHash: '$2a$10$YourHashedPasswordHere',
    profile: {
      name: 'Nargiza Karimova',
      role: 'Manager' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'manager@boshqaruv.uz',
      permissions: ['read', 'write', 'manage_employees']
    }
  },
  user: {
    passwordHash: '$2a$10$YourHashedPasswordHere',
    profile: {
      name: 'Javohir Tursunov',
      role: 'Xodim' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'user@boshqaruv.uz',
      permissions: ['read', 'write_own']
    }
  },
  marketolog: {
    passwordHash: '$2a$10$YourHashedPasswordHere',
    profile: {
      name: 'Shaxriddin Adizov Sherali o\'g\'li',
      role: 'Marketing boshqaruvchisi' as const,
      avatar: '/api/placeholder/40/40',
      status: 'online' as const,
      email: 'marketing@boshqaruv.uz',
      permissions: ['read', 'write', 'manage_marketing']
    }
  }
};

// Session storage keys
const SESSION_KEYS = {
  TOKEN: 'boshqaruv-session-token',
  REFRESH_TOKEN: 'boshqaruv-refresh-token',
  USER: 'boshqaruv-user-profile',
  EXPIRES_AT: 'boshqaruv-session-expires'
};

// Rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

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
export const login = async (credentials: LoginCredentials): Promise<{
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
        error: 'Juda ko\'p muvaffaqiyatsiz urinishlar. 15 daqiqadan so\'ng qayta urinib ko\'ring.'
      };
    }
    
    // Validate user exists
    const userRecord = SECURE_USER_DB[username as keyof typeof SECURE_USER_DB];
    if (!userRecord) {
      recordFailedAttempt(username);
      return {
        success: false,
        error: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
      };
    }
    
    // In development, accept default passwords for demo
    // In production, always use hashed passwords
    let isValidPassword = false;
    if (import.meta.env.VITE_APP_ENV === 'development') {
      // Demo passwords for development
      const demoPasswords: Record<string, string> = {
        admin: 'admin123',
        manager: 'manager123',
        user: 'user123',
        marketolog: 'marketing123'
      };
      isValidPassword = password === demoPasswords[username];
    } else {
      // Production: verify against hash
      isValidPassword = await verifyPassword(password, userRecord.passwordHash);
    }
    
    if (!isValidPassword) {
      recordFailedAttempt(username);
      return {
        success: false,
        error: 'Noto\'g\'ri foydalanuvchi nomi yoki parol'
      };
    }
    
    // Clear failed attempts on successful login
    clearLoginAttempts(username);
    
    // Generate tokens
    const tokenPayload = {
      username,
      role: userRecord.profile.role,
      permissions: userRecord.profile.permissions
    };
    
    const token = generateToken(tokenPayload, '1h');
    const refreshToken = generateToken(tokenPayload, '7d');
    
    // Store session
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
    safeLocalStorage.setItem(SESSION_KEYS.TOKEN, token);
    safeLocalStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken);
    safeLocalStorage.setItem(SESSION_KEYS.USER, userRecord.profile);
    safeLocalStorage.setItem(SESSION_KEYS.EXPIRES_AT, expiresAt);
    
    return {
      success: true,
      token,
      refreshToken,
      user: userRecord.profile
    };
  } catch (error) {
    return {
      success: false,
      error: 'Login xatosi yuz berdi'
    };
  }
};

/**
 * Logout and clear session
 */
export const logout = (): void => {
  Object.values(SESSION_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get current session
 */
export const getSession = (): {
  isValid: boolean;
  user?: UserProfile;
  token?: string;
} => {
  try {
    const token = safeLocalStorage.getItem(SESSION_KEYS.TOKEN, null);
    const user = safeLocalStorage.getItem(SESSION_KEYS.USER, null);
    const expiresAt = safeLocalStorage.getItem(SESSION_KEYS.EXPIRES_AT, 0);
    
    if (!token || !user) {
      return { isValid: false };
    }
    
    // Check if session expired
    if (Date.now() > expiresAt) {
      // Try to refresh token
      const refreshToken = safeLocalStorage.getItem(SESSION_KEYS.REFRESH_TOKEN, null);
      if (refreshToken) {
        try {
          const decoded = verifyToken(refreshToken);
          const newToken = generateToken({
            username: decoded.username,
            role: decoded.role,
            permissions: decoded.permissions
          }, '1h');
          
          const newExpiresAt = Date.now() + (60 * 60 * 1000);
          safeLocalStorage.setItem(SESSION_KEYS.TOKEN, newToken);
          safeLocalStorage.setItem(SESSION_KEYS.EXPIRES_AT, newExpiresAt);
          
          return {
            isValid: true,
            user,
            token: newToken
          };
        } catch {
          logout();
          return { isValid: false };
        }
      }
      
      logout();
      return { isValid: false };
    }
    
    // Verify token is still valid
    try {
      verifyToken(token);
      return {
        isValid: true,
        user,
        token
      };
    } catch {
      logout();
      return { isValid: false };
    }
  } catch {
    return { isValid: false };
  }
};

/**
 * Check if user has permission
 */
export const hasPermission = (permission: string): boolean => {
  const session = getSession();
  if (!session.isValid || !session.user) return false;
  
  const userRecord = Object.values(SECURE_USER_DB).find(
    record => record.profile.name === session.user!.name
  );
  
  if (!userRecord) return false;
  
  return userRecord.profile.permissions.includes('all') ||
         userRecord.profile.permissions.includes(permission);
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
    marketolog: 'marketing123'
  };
  
  for (const [username, password] of Object.entries(passwords)) {
    const hash = await hashPassword(password);
    // In production, save to database
    // For demo, we're using the hardcoded hashes
  }
};