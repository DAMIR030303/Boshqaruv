import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Toaster } from 'sonner';

import { AppRouter } from './AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileLogin } from './components/mobile/MobileLogin';
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar (Desktop & Mobile Drawer) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          onNavigate={handleNavigate}
          userProfile={userProfile}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
          {/* Header */}
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            userProfile={userProfile}
          />

          <OfflineIndicator />

          {/* Main Scrollable Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-300">
              {prefersReducedMotion ? (
                <div key={activeTab}>
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

        {/* Toast notifications */}
        <Toaster
          position="top-right"
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
