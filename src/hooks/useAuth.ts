import { useCallback, useEffect, useState } from 'react';

import {
  logout as authLogout,
  getSession,
  login,
} from '../services/authService';
import type { UserProfile } from '../types';

/**
 * Authentication hook - Login, logout va session boshqaruvi
 *
 * Bu hook foydalanuvchi autentifikatsiyasini boshqaradi va
 * session ma'lumotlarini authService orqali boshqaradi.
 *
 * @returns Authentication state va handler funksiyalar
 */
export function useAuth() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication from session
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'useAuth.ts:20',
        message: 'Auth initialization started',
        data: {},
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion agent log
    const initializeAuth = async () => {
      try {
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'useAuth.ts:23',
              message: 'Calling getSession',
              data: {},
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }),
          }
        ).catch(() => {});
        // #endregion agent log
        const session = await getSession();
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'useAuth.ts:26',
              message: 'getSession result',
              data: { isValid: session.isValid, hasUser: !!session.user },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }),
          }
        ).catch(() => {});
        // #endregion agent log
        if (session.isValid && session.user) {
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'useAuth.ts:28',
                message: 'Setting authenticated state',
                data: { userId: session.user?.id },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }),
            }
          ).catch(() => {});
          // #endregion agent log
          setUserProfile(session.user);
          setIsAuthenticated(true);
        } else {
          // #region agent log
          fetch(
            'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'useAuth.ts:32',
                message: 'No valid session found',
                data: {},
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }),
            }
          ).catch(() => {});
          // #endregion agent log
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'useAuth.ts:36',
              message: 'Auth initialization error',
              data: {
                error: error instanceof Error ? error.message : String(error),
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }),
          }
        ).catch(() => {});
        // #endregion agent log
        // Error is handled silently in production
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        // #region agent log
        fetch(
          'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'useAuth.ts:40',
              message: 'Auth initialization completed',
              data: {},
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }),
          }
        ).catch(() => {});
        // #endregion agent log
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login funksiyasi
   *
   * @param username - Foydalanuvchi nomi
   * @param password - Parol
   * @throws Error agar login muvaffaqiyatsiz bo'lsa
   */
  const handleLogin = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const result = await login({ username, password });

        if (result.success && result.user) {
          setUserProfile(result.user);
          setIsAuthenticated(true);
        } else {
          throw new Error(
            result.error || "Noto'g'ri foydalanuvchi nomi yoki parol"
          );
        }
      } catch (error) {
        setUserProfile(null);
        setIsAuthenticated(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Logout funksiyasi
   *
   * Bu funksiya foydalanuvchini tizimdan chiqaradi va
   * session ma'lumotlarini tozalaydi.
   */
  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authLogout();
      setUserProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Even if logout fails, clear local state
      setUserProfile(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Profil yangilanish funksiyasi
   *
   * @param profile - Yangi profil ma'lumotlari
   */
  const handleProfileUpdate = useCallback(async (profile: UserProfile) => {
    setUserProfile(profile);
    // Update session storage
    const { safeLocalStorage } = await import('../utils/storage');
    const SESSION_KEYS = {
      USER: 'boshqaruv-user-profile',
    };
    safeLocalStorage.setItem(SESSION_KEYS.USER, profile);
  }, []);

  return {
    isAuthenticated,
    userProfile,
    isLoading,
    handleLogin,
    handleLogout,
    handleProfileUpdate,
  };
}
