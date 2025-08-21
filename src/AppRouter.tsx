import { Suspense, lazy } from 'react';
import { LoadingFallback } from './components/LoadingFallback';
import { isEmployeeRole } from './utils/auth';
import type { KPIData, UserProfile } from './types';

// Lazy load mobile-optimized components
const MobileDashboard = lazy(() => import('./components/mobile/MobileDashboard').then(m => ({ default: m.MobileDashboard })));
const MobileEmployees = lazy(() => import('./components/mobile/MobileEmployees').then(m => ({ default: m.MobileEmployees })));
const MobileShifts = lazy(() => import('./components/mobile/MobileShifts').then(m => ({ default: m.MobileShifts })));
const MobileTasks = lazy(() => import('./components/mobile/MobileTasks').then(m => ({ default: m.MobileTasks })));
const MobileAttendance = lazy(() => import('./components/mobile/MobileAttendance').then(m => ({ default: m.MobileAttendance })));
const MobilePenalties = lazy(() => import('./components/mobile/MobilePenalties').then(m => ({ default: m.MobilePenalties })));
const MobileReports = lazy(() => import('./components/mobile/MobileReports').then(m => ({ default: m.MobileReports })));
const MobileSettings = lazy(() => import('./components/mobile/MobileSettings').then(m => ({ default: m.MobileSettings })));
const MobileProfile = lazy(() => import('./components/mobile/MobileProfile').then(m => ({ default: m.MobileProfile })));

// Employee components
const EmployeeDashboard = lazy(() => import('./components/mobile/EmployeeDashboard').then(m => ({ default: m.EmployeeDashboard })));
const EmployeeTasks = lazy(() => import('./components/mobile/EmployeeTasks').then(m => ({ default: m.EmployeeTasks })));
const EmployeeAttendance = lazy(() => import('./components/mobile/EmployeeAttendance').then(m => ({ default: m.EmployeeAttendance })));
const EmployeeReports = lazy(() => import('./components/mobile/EmployeeReports').then(m => ({ default: m.EmployeeReports })));

interface AppRouterProps {
  activeTab: string;
  kpiData: KPIData;
  userProfile: UserProfile;
  isDark: boolean;
  onDataUpdate: (data: any) => void;
  onNavigate: (tab: string) => void;
  onThemeToggle: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

export function AppRouter({
  activeTab,
  kpiData,
  userProfile,
  isDark,
  onDataUpdate,
  onNavigate,
  onThemeToggle,
  onProfileUpdate,
  onLogout
}: AppRouterProps) {
  const commonProps = {
    kpiData,
    userProfile,
    onDataUpdate
  };

  // Employee/Marketolog interface
  if (isEmployeeRole(userProfile.role)) {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingFallback message="Dashboard yuklanmoqda..." />}>
            <EmployeeDashboard {...commonProps} onNavigate={onNavigate} />
          </Suspense>
        );
      case 'tasks':
        return (
          <Suspense fallback={<LoadingFallback message="Vazifalar yuklanmoqda..." />}>
            <EmployeeTasks {...commonProps} />
          </Suspense>
        );
      case 'attendance':
        return (
          <Suspense fallback={<LoadingFallback message="Davomat ma'lumotlari yuklanmoqda..." />}>
            <EmployeeAttendance {...commonProps} />
          </Suspense>
        );
      case 'reports':
        return (
          <Suspense fallback={<LoadingFallback message="Hisobotlar yuklanmoqda..." />}>
            <EmployeeReports {...commonProps} />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingFallback message="Sozlamalar yuklanmoqda..." />}>
            <MobileSettings {...commonProps} isDark={isDark} onThemeToggle={onThemeToggle} />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<LoadingFallback message="Profil yuklanmoqda..." />}>
            <MobileProfile {...commonProps} onProfileUpdate={onProfileUpdate} onLogout={onLogout} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback message="Dashboard yuklanmoqda..." />}>
            <EmployeeDashboard {...commonProps} onNavigate={onNavigate} />
          </Suspense>
        );
    }
  }

  // Admin/Manager interface
  switch (activeTab) {
    case 'dashboard':
      return (
        <Suspense fallback={<LoadingFallback message="Dashboard yuklanmoqda..." />}>
          <MobileDashboard {...commonProps} onNavigate={onNavigate} />
        </Suspense>
      );
    case 'employees':
      return (
        <Suspense fallback={<LoadingFallback message="Xodimlar ma'lumotlari yuklanmoqda..." />}>
          <MobileEmployees {...commonProps} />
        </Suspense>
      );
    case 'shifts':
      return (
        <Suspense fallback={<LoadingFallback message="Smenalar yuklanmoqda..." />}>
          <MobileShifts {...commonProps} />
        </Suspense>
      );
    case 'tasks':
      return (
        <Suspense fallback={<LoadingFallback message="Vazifalar yuklanmoqda..." />}>
          <MobileTasks {...commonProps} />
        </Suspense>
      );
    case 'attendance':
      return (
        <Suspense fallback={<LoadingFallback message="Davomat ma'lumotlari yuklanmoqda..." />}>
          <MobileAttendance {...commonProps} />
        </Suspense>
      );
    case 'penalties':
      return (
        <Suspense fallback={<LoadingFallback message="Jarimalar yuklanmoqda..." />}>
          <MobilePenalties {...commonProps} />
        </Suspense>
      );
    case 'reports':
      return (
        <Suspense fallback={<LoadingFallback message="Hisobotlar yuklanmoqda..." />}>
          <MobileReports {...commonProps} />
        </Suspense>
      );
    case 'settings':
      return (
        <Suspense fallback={<LoadingFallback message="Sozlamalar yuklanmoqda..." />}>
          <MobileSettings {...commonProps} isDark={isDark} onThemeToggle={onThemeToggle} />
        </Suspense>
      );
    case 'profile':
      return (
        <Suspense fallback={<LoadingFallback message="Profil yuklanmoqda..." />}>
          <MobileProfile {...commonProps} onProfileUpdate={onProfileUpdate} onLogout={onLogout} />
        </Suspense>
      );
    default:
      return (
        <Suspense fallback={<LoadingFallback message="Dashboard yuklanmoqda..." />}>
          <MobileDashboard {...commonProps} onNavigate={onNavigate} />
        </Suspense>
      );
  }
}
