import {
  BarChart3,
  Calendar,
  CheckSquare,
  Home,
  Settings,
  User,
} from 'lucide-react';

import type { UserProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

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
        <Logo size="md" variant="simple" />
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
            <Avatar name={userProfile.name} size="md" />
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
