import {
  BarChart3,
  Calendar,
  CheckSquare,
  Home,
  Settings,
  User,
} from 'lucide-react';

import type { UserProfile } from '../../types';

/**
 * Employee Tab Bar komponenti props
 */
interface EmployeeTabBarProps {
  /** Aktiv tab nomi */
  activeTab: string;
  /** Navigatsiya handler */
  onNavigate: (tab: string) => void;
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile?: UserProfile;
}

/**
 * Responsive Employee Bottom Navigation
 * - Mobile/Tablet: Bottom tab bar
 * - Desktop (lg+): Yashiriladi
 */
export function EmployeeTabBar({ activeTab, onNavigate }: EmployeeTabBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Bosh', icon: Home },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'reports', label: 'Hisobotlar', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="app-bottom-nav lg:hidden" aria-label="Xodim navigatsiyasi">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
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
 * Employee Desktop Sidebar
 */
export function EmployeeSidebar({
  activeTab,
  onNavigate,
  userProfile,
}: EmployeeTabBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: Home },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'reports', label: 'Hisobotlar', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
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
            Xodim paneli
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

      {/* User info */}
      {userProfile && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
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
