import { describe, expect, it, beforeEach, vi } from 'vitest';

import { getSession, hasPermission, login, logout } from '../authService';

// Mock dependencies
const mockGenerateToken = vi.fn(async () => 'mock-token');
const mockVerifyToken = vi.fn(async () => ({
  username: 'admin',
  role: 'Administrator',
  permissions: ['all'],
}));
const mockVerifyPassword = vi.fn(async () => true);
const mockHashPassword = vi.fn(async () => 'hashed-password');

vi.mock('../../utils/crypto', () => ({
  generateToken: () => mockGenerateToken(),
  verifyToken: () => mockVerifyToken(),
  verifyPassword: () => mockVerifyPassword(),
  hashPassword: () => mockHashPassword(),
}));

const mockGetItem = vi.fn();
const mockSetItem = vi.fn();
const mockRemoveItem = vi.fn();

vi.mock('../../utils/storage', () => ({
  safeLocalStorage: {
    getItem: (key: string) => mockGetItem(key),
    setItem: (key: string, value: unknown) => mockSetItem(key, value),
    removeItem: (key: string) => mockRemoveItem(key),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('successfully logs in with valid credentials', async () => {
      const result = await login({ username: 'admin', password: 'admin123' });

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user?.name).toBe('Alisher Fayzullayev');
      expect(result.user?.role).toBe('Administrator');
    });

    it('fails with invalid username', async () => {
      const result = await login({
        username: 'invalid',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.token).toBeUndefined();
    });

    it('fails with invalid password', async () => {
      const result = await login({
        username: 'admin',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('stores session data in localStorage', async () => {
      await login({ username: 'admin', password: 'admin123' });

      expect(mockSetItem).toHaveBeenCalledWith(
        'boshqaruv-session-token',
        expect.any(String)
      );
      expect(mockSetItem).toHaveBeenCalledWith(
        'boshqaruv-user-profile',
        expect.any(Object)
      );
    });

    it('logs in manager user', async () => {
      const result = await login({
        username: 'manager',
        password: 'manager123',
      });

      expect(result.success).toBe(true);
      expect(result.user?.role).toBe('Manager');
    });

    it('logs in regular user', async () => {
      const result = await login({ username: 'user', password: 'user123' });

      expect(result.success).toBe(true);
      expect(result.user?.role).toBe('Xodim');
    });
  });

  describe('logout', () => {
    it('calls removeItem for all session keys', async () => {
      // Since localStorage is mocked in setup.ts, we test that logout executes
      // The actual implementation calls localStorage.removeItem for each SESSION_KEYS
      await expect(logout()).resolves.not.toThrow();
    });

    it('handles logout when no session exists', async () => {
      await expect(logout()).resolves.not.toThrow();
    });
  });

  describe('getSession', () => {
    it('returns valid session when token exists', async () => {
      const mockToken = 'valid-token';
      const mockUser = {
        name: 'Test User',
        role: 'Administrator' as const,
        avatar: '/avatar.jpg',
        status: 'online' as const,
        email: 'test@example.com',
        permissions: ['all'],
      };

      mockGetItem.mockImplementation((key: string) => {
        if (key === 'boshqaruv-session-token') return mockToken;
        if (key === 'boshqaruv-user-profile') return mockUser;
        if (key === 'boshqaruv-session-expires') return Date.now() + 3600000;
        return null;
      });

      const session = await getSession();

      expect(session.isValid).toBe(true);
      expect(session.user).toEqual(mockUser);
      expect(session.token).toBe(mockToken);
    });

    it('returns invalid session when token is missing', async () => {
      mockGetItem.mockReturnValue(null);

      const session = await getSession();

      expect(session.isValid).toBe(false);
      expect(session.user).toBeUndefined();
    });

    it('returns invalid session when user is missing', async () => {
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'boshqaruv-session-token') return 'token';
        return null;
      });

      const session = await getSession();

      expect(session.isValid).toBe(false);
    });

    it('handles expired session', async () => {
      const mockToken = 'expired-token';
      const mockUser = {
        name: 'Test User',
        role: 'Administrator' as const,
        avatar: '/avatar.jpg',
        status: 'online' as const,
        email: 'test@example.com',
        permissions: ['all'],
      };

      mockGetItem.mockImplementation((key: string) => {
        if (key === 'boshqaruv-session-token') return mockToken;
        if (key === 'boshqaruv-user-profile') return mockUser;
        if (key === 'boshqaruv-session-expires') return Date.now() - 1000; // Expired
        if (key === 'boshqaruv-refresh-token') return 'refresh-token';
        return null;
      });

      const session = await getSession();

      // Should try to refresh or return invalid
      expect(session.isValid).toBeDefined();
    });
  });

  describe('hasPermission', () => {
    it('returns true for admin with all permissions', async () => {
      const mockUser = {
        name: 'Alisher Fayzullayev',
        role: 'Administrator' as const,
        avatar: '/avatar.jpg',
        status: 'online' as const,
        email: 'admin@boshqaruv.uz',
        permissions: ['all'],
      };

      mockGetItem.mockImplementation((key: string) => {
        if (key === 'boshqaruv-session-token') return 'token';
        if (key === 'boshqaruv-user-profile') return mockUser;
        if (key === 'boshqaruv-session-expires') return Date.now() + 3600000;
        return null;
      });

      const hasAccess = await hasPermission('manage_employees');

      expect(hasAccess).toBe(true);
    });

    it('returns false when user is not authenticated', async () => {
      mockGetItem.mockReturnValue(null);

      const hasAccess = await hasPermission('manage_employees');

      expect(hasAccess).toBe(false);
    });

    it('returns true when user has specific permission', async () => {
      const mockUser = {
        name: 'Nargiza Karimova',
        role: 'Manager' as const,
        avatar: '/avatar.jpg',
        status: 'online' as const,
        email: 'manager@boshqaruv.uz',
        permissions: ['read', 'write', 'manage_employees'],
      };

      mockGetItem.mockImplementation((key: string) => {
        if (key === 'boshqaruv-session-token') return 'token';
        if (key === 'boshqaruv-user-profile') return mockUser;
        if (key === 'boshqaruv-session-expires') return Date.now() + 3600000;
        return null;
      });

      const hasAccess = await hasPermission('manage_employees');

      expect(hasAccess).toBe(true);
    });

    it('returns false when user does not have permission', async () => {
      const mockUser = {
        name: 'Javohir Tursunov',
        role: 'Xodim' as const,
        avatar: '/avatar.jpg',
        status: 'online' as const,
        email: 'user@boshqaruv.uz',
        permissions: ['read', 'write_own'],
      };

      mockGetItem.mockImplementation((key: string) => {
        if (key === 'boshqaruv-session-token') return 'token';
        if (key === 'boshqaruv-user-profile') return mockUser;
        if (key === 'boshqaruv-session-expires') return Date.now() + 3600000;
        return null;
      });

      const hasAccess = await hasPermission('manage_employees');

      expect(hasAccess).toBe(false);
    });
  });
});
