import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Toaster } from 'sonner';

import { AppRouter } from './AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  EmployeeSidebar,
  EmployeeTabBar,
} from './components/mobile/EmployeeTabBar';
import { MobileHeader } from './components/mobile/MobileHeader';
import { MobileLogin } from './components/mobile/MobileLogin';
import { DesktopSidebar, MobileTabBar } from './components/mobile/MobileTabBar';
import { OfflineIndicator } from './components/mobile/OfflineIndicator';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ResponsivePreview } from './components/ui/ResponsivePreview';
import { DEFAULT_ROUTE } from './config/routes';
import { ANIMATION, DEFAULT_KPI_DATA, TIMING } from './constants/app';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { useTheme } from './hooks/useTheme';
import { getTranslation } from './i18n';
import { NotificationService } from './services/notificationService';
import type { KPIData } from './types';
import { isEmployeeRole } from './utils/auth';
import { createKPIUpdateHandler, simulateKPIUpdates } from './utils/kpi';
import { setupOnlineOfflineListeners } from './utils/pwa';
import { subscribeToTables } from './utils/realtime';

/**
 * Asosiy App komponenti
 *
 * Bu komponent ilovaning asosiy strukturasini boshqaradi:
 * - Authentication va session management
 * - Theme management
 * - Navigation
 * - KPI data management
 * - Real-time subscriptions
 */
function App() {
  // Custom hooks
  const {
    isAuthenticated,
    userProfile,
    isLoading,
    handleLogin,
    handleLogout,
    handleProfileUpdate,
  } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { activeTab, handleNavigate } = useNavigation();
  const prefersReducedMotion = useReducedMotion();

  // KPI data state
  const [kpiData, setKpiData] = useState<KPIData>(DEFAULT_KPI_DATA);

  // Responsive preview state
  const [showResponsivePreview, setShowResponsivePreview] = useState(false);

  // Data update handler - use ref to keep stable reference
  // setKpiData is stable from useState, so we can create handler once
  const handleDataUpdateRef = useRef(createKPIUpdateHandler(setKpiData));

  // Wrapper function for AppRouter prop - stable reference
  const handleDataUpdate = useCallback((payload: unknown) => {
    handleDataUpdateRef.current(payload);
  }, []);

  // Realtime callback - stable reference using ref (never changes)
  const handleRealtimeUpdate = useCallback((payload: unknown) => {
    handleDataUpdateRef.current(payload);
  }, []);

  /**
   * Login handler - navigation'ni reset qiladi
   *
   * Bu funksiya login'ni amalga oshiradi va muvaffaqiyatli bo'lganda
   * navigation'ni default route'ga (dashboard) o'rnatadi.
   *
   * @param username - Foydalanuvchi nomi
   * @param password - Parol
   */
  const handleLoginWithNavigation = useCallback(
    async (username: string, password: string) => {
      await handleLogin(username, password);
      handleNavigate(DEFAULT_ROUTE);
    },
    [handleLogin, handleNavigate]
  );

  /**
   * Logout handler - navigation'ni reset qiladi
   *
   * Bu funksiya logout'ni amalga oshiradi va navigation'ni
   * default route'ga (dashboard) o'rnatadi.
   */
  const handleLogoutWithNavigation = useCallback(() => {
    handleLogout();
    handleNavigate(DEFAULT_ROUTE);
  }, [handleLogout, handleNavigate]);

  // KPI simulation
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = simulateKPIUpdates(setKpiData);
      return cleanup;
    }
  }, [isAuthenticated]);

  // Online/Offline listeners
  useEffect(() => {
    const cleanup = setupOnlineOfflineListeners(
      () => {
        console.log('[App] Online');
      },
      () => {
        console.log('[App] Offline');
      }
    );

    return cleanup;
  }, []);

  // Supabase Realtime subscription for multiple tables
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'App.tsx:105',
        message: 'Realtime subscription effect triggered',
        data: { isAuthenticated },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'post-fix',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion agent log
    if (!isAuthenticated) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'App.tsx:108',
            message: 'Skipping realtime subscription - not authenticated',
            data: {},
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'D',
          }),
        }
      ).catch(() => {});
      // #endregion agent log
      return;
    }

    try {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'App.tsx:112',
            message: 'Subscribing to realtime tables',
            data: {
              tables: [
                'kpi',
                'tasks',
                'attendance',
                'shifts',
                'penalties',
                'reports',
              ],
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'D',
          }),
        }
      ).catch(() => {});
      // #endregion agent log
      const cleanup = subscribeToTables(
        ['kpi', 'tasks', 'attendance', 'shifts', 'penalties', 'reports'],
        handleRealtimeUpdate
      );
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'App.tsx:121',
            message: 'Realtime subscription created successfully',
            data: { hasCleanup: !!cleanup },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'D',
          }),
        }
      ).catch(() => {});
      // #endregion agent log
      return cleanup;
    } catch (error) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'App.tsx:124',
            message: 'Realtime subscription failed',
            data: {
              error: error instanceof Error ? error.message : String(error),
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'D',
          }),
        }
      ).catch(() => {});
      // #endregion agent log
      // Silent fail - realtime subscription optional
      console.warn('[App] Realtime subscription failed:', error);
      return () => {
        // No-op cleanup
      };
    }
  }, [isAuthenticated, handleRealtimeUpdate]);

  // Notification service initialization
  useEffect(() => {
    if (!isAuthenticated || !userProfile) return;

    // Start checking notifications every 5 minutes
    NotificationService.startChecking(5, userProfile.name);

    // Cleanup on unmount
    return () => {
      NotificationService.stopChecking();
    };
  }, [isAuthenticated, userProfile]);

  // Global error handler for unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[Global Error]', event.error);
      console.error('[Global Error] Message:', event.message);
      console.error('[Global Error] Filename:', event.filename);
      console.error('[Global Error] Lineno:', event.lineno);
      console.error('[Global Error] Colno:', event.colno);

      // Android WebView uchun qo'shimcha ma'lumot
      if (typeof window !== 'undefined' && window.navigator) {
        const isAndroid = /Android/i.test(window.navigator.userAgent);
        if (isAndroid) {
          console.error('[Global Error] Android WebView error detected');
        }
      }

      // Don't crash the app, just log the error
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[Unhandled Promise Rejection]', event.reason);
      console.error('[Unhandled Promise Rejection] Type:', typeof event.reason);

      // Android WebView uchun qo'shimcha ma'lumot
      if (typeof window !== 'undefined' && window.navigator) {
        const isAndroid = /Android/i.test(window.navigator.userAgent);
        if (isAndroid) {
          console.error(
            '[Unhandled Promise Rejection] Android WebView rejection detected'
          );
        }
      }

      // Don't crash the app, just log the error
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // i18n helper
  const t = (key: string) => getTranslation(key, 'uz');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner message={t('loading.app')} />
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600">
          <MobileLogin
            onLogin={handleLoginWithNavigation}
            isLoading={isLoading}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Main app - userProfile null check
  if (!userProfile) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LoadingSpinner message={t('loading.profile')} />
        </div>
      </ErrorBoundary>
    );
  }

  // Debug logging
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/96756b51-bfed-4036-adea-abfaa325b2f9', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'App.tsx:218',
      message: 'App render state',
      data: {
        isAuthenticated,
        hasUserProfile: !!userProfile,
        activeTab,
        isLoading,
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'E',
    }),
  }).catch(() => {});
  // #endregion agent log
  console.log('[App] Render - isAuthenticated:', isAuthenticated);
  console.log('[App] Render - userProfile:', userProfile);
  console.log('[App] Render - activeTab:', activeTab);
  console.log('[App] Render - isLoading:', isLoading);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar - Visible on lg+ screens */}
        <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {isEmployeeRole(userProfile.role) ? (
            <EmployeeSidebar
              activeTab={activeTab}
              onNavigate={handleNavigate}
              userProfile={userProfile}
            />
          ) : (
            <DesktopSidebar
              activeTab={activeTab}
              onNavigate={handleNavigate}
              userProfile={userProfile}
            />
          )}
        </div>

        {/* Header - Mobile only (logo mostly) / Desktop (actions only) */}
        <div className="lg:pl-72 transition-all duration-200">
          <MobileHeader
            userProfile={userProfile}
            isDark={isDark}
            onThemeToggle={toggleTheme}
            onNavigate={handleNavigate}
            onLogout={handleLogoutWithNavigation}
            onResponsivePreview={() => setShowResponsivePreview(true)}
          />

          {/* Offline Indicator */}
          <OfflineIndicator />

          {/* Main Content */}
          <main
            className="pt-20 pb-24 lg:pt-8 lg:pb-8"
            style={{
              minHeight: 'calc(100vh - 80px)',
              backgroundColor: 'var(--bg-color, #f9fafb)',
            }}
          >
            <div className="container mx-auto px-4 max-w-7xl">
              {prefersReducedMotion ? (
                <div key={activeTab} style={{ minHeight: '60vh' }}>
                  <AppRouter
                    activeTab={activeTab}
                    kpiData={kpiData}
                    userProfile={userProfile}
                    isDark={isDark}
                    onDataUpdate={handleDataUpdate}
                    onNavigate={handleNavigate}
                    onThemeToggle={toggleTheme}
                    onProfileUpdate={handleProfileUpdate}
                    onLogout={handleLogoutWithNavigation}
                  />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: ANIMATION.DURATION_MEDIUM }}
                    style={{ minHeight: '60vh' }}
                  >
                    <AppRouter
                      activeTab={activeTab}
                      kpiData={kpiData}
                      userProfile={userProfile}
                      isDark={isDark}
                      onDataUpdate={handleDataUpdate}
                      onNavigate={handleNavigate}
                      onThemeToggle={toggleTheme}
                      onProfileUpdate={handleProfileUpdate}
                      onLogout={handleLogoutWithNavigation}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </main>
        </div>

        {/* Bottom Navigation - Hidden on desktop (lg+) via CSS */}
        {isEmployeeRole(userProfile.role) ? (
          <EmployeeTabBar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            userProfile={userProfile}
          />
        ) : (
          <MobileTabBar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            userProfile={userProfile}
          />
        )}

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={TIMING.TOAST_DURATION}
        />

        {/* Responsive Preview Modal */}
        <ResponsivePreview
          isOpen={showResponsivePreview}
          onClose={() => setShowResponsivePreview(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
