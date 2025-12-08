import { ComponentType, lazy } from 'react';

import type { KPIData, UserProfile } from '../types';

/**
 * Route konfiguratsiyasi - Barcha route'lar va ularning komponentlari
 *
 * Bu fayl barcha route konfiguratsiyalarini markazlashtirib,
 * takrorlanishni kamaytiradi va kodni tushunishga oson qiladi.
 */

/**
 * Route komponenti props interface
 */
export interface RouteComponentProps extends Record<string, unknown> {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  onNavigate?: (tab: string) => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
  onLogout?: () => void;
}

/**
 * Route konfiguratsiyasi
 */
export interface RouteConfig {
  /** Route nomi (tab nomi) */
  name: string;
  /** Loading paytida ko'rsatiladigan xabar */
  loadingMessage: string;
  /** Lazy yuklanadigan komponent */
  component: ComponentType<RouteComponentProps>;
  /** Qo'shimcha props'lar (ixtiyoriy) */
  additionalProps?: (
    props: RouteComponentProps
  ) => Partial<RouteComponentProps>;
}

/**
 * Admin/Manager uchun route konfiguratsiyalari
 */
export const adminRoutes: RouteConfig[] = [
  {
    name: 'dashboard',
    loadingMessage: 'Dashboard yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileDashboard')
        .then(m => ({ default: m.MobileDashboard }))
        .catch(error => {
          console.error('[Routes] Failed to load MobileDashboard:', error);
          // Re-throw error - LazyRoute will handle it with ErrorBoundary
          throw error;
        })
    ) as ComponentType<RouteComponentProps>,
    additionalProps: props => ({ onNavigate: props.onNavigate }),
  },
  {
    name: 'employees',
    loadingMessage: "Xodimlar ma'lumotlari yuklanmoqda...",
    component: lazy(() =>
      import('../components/mobile/MobileEmployees').then(m => ({
        default: m.MobileEmployees,
      }))
    ),
  },
  {
    name: 'shifts',
    loadingMessage: 'Smenalar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileShifts').then(m => ({
        default: m.MobileShifts,
      }))
    ),
  },
  {
    name: 'tasks',
    loadingMessage: 'Vazifalar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileTasks').then(m => ({
        default: m.MobileTasks,
      }))
    ),
  },
  {
    name: 'attendance',
    loadingMessage: "Davomat ma'lumotlari yuklanmoqda...",
    component: lazy(() =>
      import('../components/mobile/MobileAttendance').then(m => ({
        default: m.MobileAttendance,
      }))
    ),
  },
  {
    name: 'penalties',
    loadingMessage: 'Jarimalar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobilePenalties').then(m => ({
        default: m.MobilePenalties,
      }))
    ),
  },
  {
    name: 'reports',
    loadingMessage: 'Hisobotlar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileReports').then(m => ({
        default: m.MobileReports,
      }))
    ),
  },
  {
    name: 'settings',
    loadingMessage: 'Sozlamalar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileSettings').then(m => ({
        default: m.MobileSettings,
      }))
    ),
    additionalProps: props => ({
      isDark: props.isDark,
      onThemeToggle: props.onThemeToggle,
    }),
  },
  {
    name: 'profile',
    loadingMessage: 'Profil yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileProfile').then(m => ({
        default: m.MobileProfile,
      }))
    ),
    additionalProps: props => ({
      onProfileUpdate: props.onProfileUpdate,
      onLogout: props.onLogout,
    }),
  },
];

/**
 * Employee/Marketing uchun route konfiguratsiyalari
 */
export const employeeRoutes: RouteConfig[] = [
  {
    name: 'dashboard',
    loadingMessage: 'Dashboard yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/EmployeeDashboard').then(m => ({
        default: m.EmployeeDashboard,
      }))
    ) as ComponentType<RouteComponentProps>,
    additionalProps: props => ({ onNavigate: props.onNavigate }),
  },
  {
    name: 'tasks',
    loadingMessage: 'Vazifalar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/EmployeeTasks').then(m => ({
        default: m.EmployeeTasks,
      }))
    ),
  },
  {
    name: 'attendance',
    loadingMessage: "Davomat ma'lumotlari yuklanmoqda...",
    component: lazy(() =>
      import('../components/mobile/EmployeeAttendance').then(m => ({
        default: m.EmployeeAttendance,
      }))
    ),
  },
  {
    name: 'reports',
    loadingMessage: 'Hisobotlar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/EmployeeReports').then(m => ({
        default: m.EmployeeReports,
      }))
    ),
  },
  {
    name: 'settings',
    loadingMessage: 'Sozlamalar yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileSettings').then(m => ({
        default: m.MobileSettings,
      }))
    ),
    additionalProps: props => ({
      isDark: props.isDark,
      onThemeToggle: props.onThemeToggle,
    }),
  },
  {
    name: 'profile',
    loadingMessage: 'Profil yuklanmoqda...',
    component: lazy(() =>
      import('../components/mobile/MobileProfile').then(m => ({
        default: m.MobileProfile,
      }))
    ),
    additionalProps: props => ({
      onProfileUpdate: props.onProfileUpdate,
      onLogout: props.onLogout,
    }),
  },
];

/**
 * Route'ni topish funksiyasi
 *
 * @param routes - Route konfiguratsiyalari ro'yxati
 * @param routeName - Qidirilayotgan route nomi
 * @returns Topilgan route konfiguratsiyasi yoki undefined
 */
export function findRoute(
  routes: RouteConfig[],
  routeName: string
): RouteConfig | undefined {
  return routes.find(route => route.name === routeName);
}

/**
 * Default route nomi
 */
export const DEFAULT_ROUTE = 'dashboard';
