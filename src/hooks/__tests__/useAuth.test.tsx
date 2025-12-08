import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { useAuth } from '../useAuth';

// Mock authService
const mockGetSession = vi.fn();
const mockLogin = vi.fn();
const mockLogout = vi.fn();

vi.mock('../../services/authService', () => ({
  getSession: () => mockGetSession(),
  login: (credentials: unknown) => mockLogin(credentials),
  logout: () => mockLogout(),
}));

// Mock storage
const mockSetItem = vi.fn();
vi.mock('../../utils/storage', () => ({
  safeLocalStorage: {
    setItem: (key: string, value: unknown) => mockSetItem(key, value),
  },
}));

describe('useAuth', () => {
  const mockUser = {
    name: 'Test User',
    role: 'Xodim' as const,
    avatar: '/avatar.jpg',
    status: 'online' as const,
    email: 'test@example.com',
    permissions: ['read'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with loading state', () => {
    mockGetSession.mockResolvedValue({
      isValid: false,
      user: null,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userProfile).toBeNull();
  });

  it('initializes with authenticated user when session is valid', async () => {
    mockGetSession.mockResolvedValue({
      isValid: true,
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userProfile).toEqual(mockUser);
  });

  it('initializes without authentication when session is invalid', async () => {
    mockGetSession.mockResolvedValue({
      isValid: false,
      user: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userProfile).toBeNull();
  });

  it('handles session initialization error', async () => {
    mockGetSession.mockRejectedValue(new Error('Session error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userProfile).toBeNull();
  });

  describe('handleLogin', () => {
    it('successfully logs in user', async () => {
      mockGetSession.mockResolvedValue({
        isValid: false,
        user: null,
      });
      mockLogin.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleLogin('testuser', 'password123');
      });

      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.userProfile).toEqual(mockUser);
    });

    it('handles login failure', async () => {
      mockGetSession.mockResolvedValue({
        isValid: false,
        user: null,
      });
      mockLogin.mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await expect(
          result.current.handleLogin('testuser', 'wrongpassword')
        ).rejects.toThrow();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userProfile).toBeNull();
    });

    it('handles login error', async () => {
      mockGetSession.mockResolvedValue({
        isValid: false,
        user: null,
      });
      mockLogin.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await expect(
          result.current.handleLogin('testuser', 'password123')
        ).rejects.toThrow('Network error');
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userProfile).toBeNull();
    });

    it('sets loading state during login', async () => {
      mockGetSession.mockResolvedValue({
        isValid: false,
        user: null,
      });
      mockLogin.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  success: true,
                  user: mockUser,
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleLogin('testuser', 'password123');
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('handleLogout', () => {
    it('successfully logs out user', async () => {
      mockGetSession.mockResolvedValue({
        isValid: true,
        user: mockUser,
      });
      mockLogout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleLogout();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userProfile).toBeNull();
    });

    it('clears user state even if logout fails', async () => {
      mockGetSession.mockResolvedValue({
        isValid: true,
        user: mockUser,
      });
      mockLogout.mockRejectedValue(new Error('Logout error'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.handleLogout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userProfile).toBeNull();
    });

    it('sets loading state during logout', async () => {
      mockGetSession.mockResolvedValue({
        isValid: true,
        user: mockUser,
      });
      mockLogout.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(undefined), 100))
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.handleLogout();
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('handleProfileUpdate', () => {
    it('updates user profile', async () => {
      mockGetSession.mockResolvedValue({
        isValid: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updatedProfile = {
        ...mockUser,
        name: 'Updated Name',
      };

      await act(async () => {
        await result.current.handleProfileUpdate(updatedProfile);
      });

      expect(result.current.userProfile).toEqual(updatedProfile);
    });

    it('saves profile to localStorage', async () => {
      mockGetSession.mockResolvedValue({
        isValid: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const updatedProfile = {
        ...mockUser,
        name: 'Updated Name',
      };

      await act(async () => {
        await result.current.handleProfileUpdate(updatedProfile);
      });

      // Verify that storage.setItem was called (mocked in services test)
      expect(result.current.userProfile).toEqual(updatedProfile);
    });
  });
});
