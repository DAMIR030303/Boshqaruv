import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import { AppRouter } from './components/AppRouter';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Mobile Navigation
import { MobileTabBar } from './components/mobile/MobileTabBar';
import { MobileHeader } from './components/mobile/MobileHeader';
import { EmployeeTabBar } from './components/mobile/EmployeeTabBar';
import { MarketingTabBar } from './components/mobile/MarketingTabBar';

// Utils and Constants
import { cleanupLocalStorage } from './utils/localStorageCleanup';
import { safeLocalStorage } from './utils/storage';
import { validateCredentials, getUserProfile, getPageTitle, isEmployeeRole } from './utils/auth';
import type { UserProfile } from './utils/auth';
import { createKPIUpdateHandler, simulateKPIUpdates } from './utils/kpi';
import type { KPIData } from './utils/kpi';
import { LOCAL_STORAGE_KEYS, DEFAULT_USER_PROFILE, DEFAULT_KPI_DATA } from './constants/app';

// Lazy load login component
const MobileLogin = lazy(() => import('./components/mobile/MobileLogin').then(m => ({ default: m.MobileLogin })));

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(() => 
    safeLocalStorage.getItem(LOCAL_STORAGE_KEYS.THEME, false)
  );
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(() => 
    safeLocalStorage.getItem(LOCAL_STORAGE_KEYS.AUTH, false)
  );
  
  // Navigation state
  const [activeTab, setActiveTab] = useState(() => 
    safeLocalStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, 'dashboard')
  );
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // User state
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // KPI state
  const [kpiData, setKpiData] = useState<KPIData>(DEFAULT_KPI_DATA);

  // Initialize app
  useEffect(() => {
    cleanupLocalStorage();
    
    const initializeApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    
    initializeApp();
  }, []);

  // Theme persistence
  useEffect(() => {
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.THEME, isDark);
    
    try {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  }, [isDark]);

  // Active tab persistence
  useEffect(() => {
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  // KPI updates simulation
  useEffect(() => {
    return simulateKPIUpdates(setKpiData);
  }, []);

  // Handlers
  const toggleTheme = useCallback(() => {
    setIsDark((prev: boolean) => !prev);
    toast.success(isDark ? 'Yorug\' rejimga o\'tildi' : 'Qorong\'u rejimga o\'tildi');
  }, [isDark]);

  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  }, [activeTab]);

  const handleLogin = useCallback(async (credentials: { username: string; password: string }): Promise<boolean> => {
    const isValid = await validateCredentials(credentials);

    if (isValid) {
      setIsLoggedIn(true);
      safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, true);
      setUserProfile(getUserProfile(credentials.username));
      return true;
    }

    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    safeLocalStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, false);
    safeLocalStorage.clearAllExcept([LOCAL_STORAGE_KEYS.THEME]);

    setUserProfile({
      name: 'Foydalanuvchi',
      role: 'Mehmon',
      avatar: '/api/placeholder/40/40',
      status: 'offline'
    });

    setActiveTab('dashboard');
    toast.info('Tizimdan muvaffaqiyatli chiqildi');
  }, []);

  const handleDataUpdate = createKPIUpdateHandler(setKpiData);

  // Loading screen
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'dark' : ''}`}>
        <LoadingFallback message="Boshqaruv ilovasi yuklanmoqda..." />
      </div>
    );
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback message="Login sahifasi yuklanmoqda..." />}>
          <MobileLogin onLogin={handleLogin} isDark={isDark} />
        </Suspense>
        
        <Toaster 
          position="top-center"
          expand={false}
          richColors={true}
          closeButton={true}
          duration={3000}
        />
      </ErrorBoundary>
    );
  }

  // Determine which tab bar to show
  const renderTabBar = () => {
    if (userProfile.role === 'Marketing boshqaruvchisi') {
      return (
        <MarketingTabBar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          kpiData={kpiData}
        />
      );
    } else if (isEmployeeRole(userProfile.role)) {
      return (
        <EmployeeTabBar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          kpiData={kpiData}
        />
      );
    } else {
      return (
        <MobileTabBar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          kpiData={kpiData}
        />
      );
    }
  };

  // Main app
  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-background transition-all duration-300 ${isDark ? 'dark' : ''}`}>
        {/* Mobile Header */}
        <MobileHeader 
          title={getPageTitle(activeTab)}
          user={userProfile}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />

        {/* Main Content */}
        <main className="pb-20 pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="min-h-[calc(100vh-140px)]"
            >
              <AppRouter
                activeTab={activeTab}
                kpiData={kpiData}
                userProfile={userProfile}
                isDark={isDark}
                onDataUpdate={handleDataUpdate}
                onNavigate={handleTabChange}
                onThemeToggle={toggleTheme}
                onProfileUpdate={(profile: UserProfile) => setUserProfile(profile)}
                onLogout={handleLogout}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Tab Bar */}
        {renderTabBar()}

        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          expand={false}
          richColors={true}
          closeButton={true}
          duration={3000}
        />
      </div>
    </ErrorBoundary>
  );
}