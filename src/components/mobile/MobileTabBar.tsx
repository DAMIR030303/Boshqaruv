import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckSquare,
  Clock,
  Home,
  Settings,
  User,
  Users,
} from 'lucide-react';

import type { UserProfile } from '../../types';

/**
 * Mobile Tab Bar komponenti props
 */
interface MobileTabBarProps {
  /** Aktiv tab nomi */
  activeTab: string;
  /** Navigatsiya handler */
  onNavigate: (tab: string) => void;
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
}

/**
 * Responsive Bottom Navigation
 * - Mobile/Tablet: Bottom tab bar ko'rsatiladi
 * - Desktop (lg+): Yashiriladi (sidebar ishlatiladi)
 */
export function MobileTabBar({ activeTab, onNavigate }: MobileTabBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Bosh', icon: Home },
    { id: 'employees', label: 'Xodimlar', icon: Users },
    { id: 'shifts', label: 'Smenalar', icon: Clock },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'penalties', label: 'Jarimalar', icon: AlertTriangle },
    { id: 'reports', label: 'Hisobotlar', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  // Mobile uchun asosiy tablar (5 ta)
  const mobileTabs = tabs.slice(0, 5);

  // Tablet uchun ko'proq tablar (7 ta)
  const tabletTabs = tabs.slice(0, 7);

  return (
    <nav className="app-bottom-nav lg:hidden" aria-label="Asosiy navigatsiya">
      {/* Mobile (5 tabs) */}
      <div className="flex sm:hidden items-center justify-around">
        {mobileTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`bottom-nav-item relative z-10 pointer-events-auto ${isActive ? 'bottom-nav-item-active' : ''}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span
                  className="bottom-nav-item-indicator"
                  aria-hidden="true"
                />
              )}
              <Icon className="bottom-nav-item-icon" />
              <span className="bottom-nav-item-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tablet (7 tabs) - sm to lg */}
      <div className="hidden sm:flex lg:hidden items-center justify-around max-w-2xl mx-auto">
        {tabletTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`bottom-nav-item relative z-10 pointer-events-auto ${isActive ? 'bottom-nav-item-active' : ''}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span
                  className="bottom-nav-item-indicator"
                  aria-hidden="true"
                />
              )}
              <Icon className="bottom-nav-item-icon" />
              <span className="bottom-nav-item-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Desktop Sidebar Navigation
 * - Desktop (lg+): Sidebar ko'rsatiladi
 * - Mobile/Tablet: Yashiriladi
 */
export function DesktopSidebar({
  activeTab,
  onNavigate,
  userProfile,
}: MobileTabBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: Home },
    { id: 'employees', label: 'Xodimlar', icon: Users },
    { id: 'shifts', label: 'Smenalar', icon: Clock },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'penalties', label: 'Jarimalar', icon: AlertTriangle },
    { id: 'reports', label: 'Hisobotlar', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-white/50 to-slate-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Boshqaruv
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Boshqaruv tizimi
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`nav-item w-full ${isActive ? 'nav-item-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="nav-item-icon" />
                <span className="flex-1 text-left">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User info at bottom */}
      {userProfile && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 ring-2 ring-blue-500/20">
              <span className="text-white font-semibold">
                {userProfile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {userProfile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userProfile.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
