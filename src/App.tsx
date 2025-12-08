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
 * Responsive: Mobile / Tablet / Desktop
 */
function App() {
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

  const [kpiData, setKpiData] = useState<KPIData>(DEFAULT_KPI_DATA);
  const [showResponsivePreview, setShowResponsivePreview] = useState(false);

  const handleDataUpdateRef = useRef(createKPIUpdateHandler(setKpiData));

  const handleDataUpdate = useCallback((payload: unknown) => {
    handleDataUpdateRef.current(payload);
  }, []);

  const handleRealtimeUpdate = useCallback((payload: unknown) => {
    handleDataUpdateRef.current(payload);
  }, []);

  const handleLoginWithNavigation = useCallback(
    async (username: string, password: string) => {
      await handleLogin(username, password);
      handleNavigate(DEFAULT_ROUTE);
    },
    [handleLogin, handleNavigate]
  );

  const handleLogoutWithNavigation = useCallback(() => {
    handleLogout();
    handleNavigate(DEFAULT_ROUTE);
  }, [handleLogout, handleNavigate]);

  // KPI simulation
  useEffect(() => {
    if (isAuthenticated) {
      return simulateKPIUpdates(setKpiData);
    }
  }, [isAuthenticated]);

  // Online/Offline listeners
  useEffect(() => {
    return setupOnlineOfflineListeners(
      () => console.info('[App] Online'),
      () => console.info('[App] Offline')
    );
  }, []);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      return subscribeToTables(
        ['kpi', 'tasks', 'attendance', 'shifts', 'penalties', 'reports'],
        handleRealtimeUpdate
      );
    } catch {
      return () => {};
    }
  }, [isAuthenticated, handleRealtimeUpdate]);

  // Notification service
  useEffect(() => {
    if (!isAuthenticated || !userProfile) return;
    NotificationService.startChecking(5, userProfile.name);
    return () => NotificationService.stopChecking();
  }, [isAuthenticated, userProfile]);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[Global Error]', event.message);
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[Unhandled Rejection]', event.reason);
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

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

  // Profile loading
  if (!userProfile) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LoadingSpinner message={t('loading.profile')} />
        </div>
      </ErrorBoundary>
    );
  }

  const isEmployee = isEmployeeRole(userProfile.role);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar - lg+ screens only */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-72 lg:border-r lg:border-gray-200 lg:dark:border-gray-800 lg:bg-white lg:dark:bg-gray-900">
          {isEmployee ? (
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
        </aside>

        {/* Main Content Area - shifts right on desktop */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          {/* Header */}
          <MobileHeader
            userProfile={userProfile}
            isDark={isDark}
            onThemeToggle={toggleTheme}
            onNavigate={handleNavigate}
            onLogout={handleLogoutWithNavigation}
            onResponsivePreview={() => setShowResponsivePreview(true)}
          />

          <OfflineIndicator />

          {/* Main Content */}
          <main className="flex-1 pt-16 pb-20 lg:pt-4 lg:pb-4">
            <div className="container mx-auto px-4 max-w-7xl">
              {prefersReducedMotion ? (
                <div key={activeTab} className="min-h-[60vh]">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: ANIMATION.DURATION_MEDIUM }}
                    className="min-h-[60vh]"
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

          {/* Bottom Navigation - Mobile/Tablet only */}
          {isEmployee ? (
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
        </div>

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
