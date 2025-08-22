import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRouter } from './AppRouter';
import { MobileLogin } from './components/mobile/MobileLogin';
import { MobileHeader } from './components/mobile/MobileHeader';
import { MobileTabBar } from './components/mobile/MobileTabBar';
import { EmployeeTabBar } from './components/mobile/EmployeeTabBar';
import { safeLocalStorage } from './utils/storage';
import { DEFAULT_KPI_DATA, LOCAL_STORAGE_KEYS } from './constants/app';
import { validateCredentials, getUserProfile, isEmployeeRole } from './utils/auth';
import { createKPIUpdateHandler, simulateKPIUpdates } from './utils/kpi';
import type { UserProfile, KPIData } from './types';
import { supabase } from './utils/supabaseClient';

function App() {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData>(DEFAULT_KPI_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load theme preference
        const savedTheme = safeLocalStorage.getItem(LOCAL_STORAGE_KEYS.THEME, 'light');
        setIsDark(savedTheme === 'dark');
        
        // Load active tab
        const savedTab = safeLocalStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, 'dashboard');
        setActiveTab(savedTab);
        
        // Check authentication
        const savedAuth = safeLocalStorage.getItem(LOCAL_STORAGE_KEYS.AUTH, null);
        if (savedAuth && savedAuth.username) {
          const profile = getUserProfile(savedAuth.username);
          setUserProfile(profile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Theme management
  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme ? 'dark' : 'light');
    
    // Update DOM
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Apply theme to DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Authentication handlers
  const handleLogin = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const isValid = await validateCredentials({ username, password });
      
      if (isValid) {
        const profile = getUserProfile(username);
        setUserProfile(profile);
        setIsAuthenticated(true);
        safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, { username, password });
        setActiveTab('dashboard');
        safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, 'dashboard');
      } else {
        throw new Error('Noto\'g\'ri foydalanuvchi nomi yoki parol');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUserProfile(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, null);
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, 'dashboard');
  }, []);

  // Navigation handler
  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab);
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, tab);
  }, []);

  // Data update handler
  const handleDataUpdate = useMemo(() => createKPIUpdateHandler(setKpiData), []);

  // Profile update handler
  const handleProfileUpdate = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);

  // KPI simulation
  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = simulateKPIUpdates(setKpiData);
      return cleanup;
    }
  }, [isAuthenticated]);

  // Supabase Realtime subscription for KPI updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('realtime:kpi')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kpi' },
        (payload) => {
          const next = (payload as any)?.new;
          const data = (next && (next.data ?? next)) ?? payload;
          (handleDataUpdate as unknown as (d: unknown) => void)(data);
        }
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, handleDataUpdate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Boshqaruv yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600">
          <MobileLogin onLogin={handleLogin} isLoading={isLoading} />
        </div>
      </ErrorBoundary>
    );
  }

  // Main app
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <MobileHeader
          userProfile={userProfile as UserProfile}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />

        {/* Main Content */}
        <main className="pt-20 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AppRouter
                activeTab={activeTab}
                kpiData={kpiData}
                userProfile={userProfile as UserProfile}
                isDark={isDark}
                onDataUpdate={handleDataUpdate}
                onNavigate={handleNavigate}
                onThemeToggle={toggleTheme}
                onProfileUpdate={handleProfileUpdate}
                onLogout={handleLogout}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        {userProfile && isEmployeeRole(userProfile.role) ? (
          <EmployeeTabBar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            userProfile={userProfile}
          />
        ) : (
          <MobileTabBar
            activeTab={activeTab}
            onNavigate={handleNavigate}
            userProfile={userProfile as UserProfile}
          />
        )}

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
