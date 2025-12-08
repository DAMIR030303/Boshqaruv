import { ComponentType } from 'react';

import { LazyRoute } from './components/LazyRoute';
import {
  DEFAULT_ROUTE,
  type RouteComponentProps,
  adminRoutes,
  employeeRoutes,
  findRoute,
} from './config/routes';
import type { KPIData, UserProfile } from './types';
import { isEmployeeRole } from './utils/auth';

/**
 * App Router komponenti props
 */
interface AppRouterProps {
  /** Aktiv tab nomi */
  activeTab: string;
  /** KPI ma'lumotlari */
  kpiData: KPIData;
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile: UserProfile;
  /** Dark theme holati */
  isDark: boolean;
  /** Ma'lumotlar yangilanish handler */
  onDataUpdate: (_data: unknown) => void;
  /** Navigatsiya handler */
  onNavigate: (tab: string) => void;
  /** Theme toggle handler */
  onThemeToggle: () => void;
  /** Profil yangilanish handler */
  onProfileUpdate: (profile: UserProfile) => void;
  /** Logout handler */
  onLogout: () => void;
}

/**
 * App Router - Asosiy routing komponenti
 *
 * Bu komponent foydalanuvchi roliga qarab to'g'ri sahifani
 * ko'rsatadi va lazy loading orqali performance'ni optimallashtiradi.
 * Route konfiguratsiyasi markazlashtirilgan va takrorlanish kamaytirilgan.
 *
 * @param props - AppRouterProps
 * @returns JSX element
 */
export function AppRouter({
  activeTab,
  kpiData,
  userProfile,
  isDark,
  onDataUpdate,
  onNavigate,
  onThemeToggle,
  onProfileUpdate,
  onLogout,
}: AppRouterProps) {
  // Foydalanuvchi roliga qarab route konfiguratsiyasini tanlash
  const routes = isEmployeeRole(userProfile.role)
    ? employeeRoutes
    : adminRoutes;

  // Aktiv route'ni topish
  let route = findRoute(routes, activeTab);

  // Debug logging
  console.log('[AppRouter] activeTab:', activeTab);
  console.log('[AppRouter] userProfile.role:', userProfile.role);
  console.log('[AppRouter] routes count:', routes.length);
  console.log('[AppRouter] route found:', route ? route.name : 'NOT FOUND');

  // Agar route topilmasa, 404 ko'rsatish
  if (!route) {
    const defaultRoute = findRoute(routes, DEFAULT_ROUTE);
    if (!defaultRoute) {
      // Xato holati - hech qanday route topilmaydi
      return (
        <div
          className="mobile-content"
          style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '2rem',
          }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sahifa topilmadi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.
            </p>
            <button
              onClick={() => onNavigate(DEFAULT_ROUTE)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      );
    }
    // Default route'ni ko'rsatish
    route = defaultRoute;
  }

  // Umumiy props'lar
  const commonProps: RouteComponentProps = {
    kpiData,
    userProfile,
    onDataUpdate,
    onNavigate,
    isDark,
    onThemeToggle,
    onProfileUpdate,
    onLogout,
  };

  // Qo'shimcha props'larni qo'shish
  const finalProps = route.additionalProps
    ? { ...commonProps, ...route.additionalProps(commonProps) }
    : commonProps;

  return (
    <LazyRoute
      component={route.component as ComponentType<Record<string, unknown>>}
      message={route.loadingMessage}
      props={finalProps}
    />
  );
}
