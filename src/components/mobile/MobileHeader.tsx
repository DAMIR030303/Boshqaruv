import { useEffect, useState } from 'react';

import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Smartphone,
  Sun,
} from 'lucide-react';

import { NotificationService } from '../../services/notificationService';
import type { UserProfile } from '../../types';
import { isEmployeeRole } from '../../utils/auth';

import { MenuDropdown } from './MenuDropdown';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { RealtimeStatus } from './RealtimeStatus';
import { SearchModal } from './SearchModal';

interface MobileHeaderProps {
  userProfile: UserProfile;
  isDark: boolean;
  onThemeToggle: () => void;
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
  onResponsivePreview?: () => void;
}

/**
 * Responsive Header komponenti
 * - Mobile: Kompakt, hamburger menu
 * - Tablet/Desktop: Kengaytirilgan, barcha tugmalar ko'rinadi
 */
export function MobileHeader({
  userProfile,
  isDark,
  onThemeToggle,
  onNavigate,
  onLogout,
  onResponsivePreview,
}: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if we're in responsive preview mode and if it's mobile size
  const urlParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const isPreviewMode = urlParams?.get('responsive-preview') === 'true';
  const previewWidth = urlParams?.get('preview-width');
  const isMobilePreview =
    isPreviewMode && previewWidth && parseInt(previewWidth) < 768;

  // O'qilmagan bildirishnomalar sonini yangilash
  useEffect(() => {
    const updateUnreadCount = () => {
      const count = NotificationService.getUnreadCount();
      setUnreadCount(count);
    };

    updateUnreadCount();

    NotificationService.addListener(() => {
      updateUnreadCount();
    });

    const interval = setInterval(updateUnreadCount, 30000);

    return () => {
      NotificationService.removeListener(updateUnreadCount);
      clearInterval(interval);
    };
  }, []);

  const handleNavigate = (url: string) => {
    const tab = url.split('/')[1] || url.replace('/', '');
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const closeAllDropdowns = () => {
    setShowSearch(false);
    setShowNotifications(false);
    setShowProfile(false);
    setShowMenu(false);
  };

  return (
    <header className="app-header">
      <div className="app-header-content">
        {/* Left side - Logo and Menu (Hidden on Desktop because Sidebar takes over) */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile menu button */}
          {!isMobilePreview && (
            <div className="relative">
              <button
                aria-label="Menyu"
                onClick={() => {
                  setShowMenu(!showMenu);
                  setShowNotifications(false);
                  setShowProfile(false);
                  setShowSearch(false);
                }}
                className="btn-icon btn-ghost"
              >
                <Menu className="w-5 h-5" />
              </button>
              <MenuDropdown
                isOpen={showMenu}
                onClose={() => setShowMenu(false)}
                onNavigate={onNavigate || (() => {})}
                userProfile={userProfile}
                isEmployee={isEmployeeRole(userProfile.role)}
              />
            </div>
          )}

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
              <svg
                className="w-5 h-5 text-white"
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
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Boshqaruv
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Boshqaruv tizimi
              </p>
            </div>
            <span className="sm:hidden text-lg font-bold text-slate-900 dark:text-white">
              Boshqaruv
            </span>
          </div>

          {/* Real-time Status Indicator */}
          <RealtimeStatus />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Responsive Preview Button - Hidden in preview mode */}
          {onResponsivePreview && !isPreviewMode && (
            <button
              aria-label="Mobil ko'rinishni ko'rish"
              onClick={onResponsivePreview}
              className="btn-icon btn-ghost relative z-50"
              title="Mobil ko'rinishni ko'rish (Responsive Preview)"
            >
              <Smartphone className="w-5 h-5" />
            </button>
          )}

          {/* Search Button - Hidden in mobile preview mode */}
          {!isMobilePreview && (
            <div className="relative">
              <button
                aria-label="Qidirish"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setShowNotifications(false);
                  setShowProfile(false);
                  setShowMenu(false);
                }}
                className="btn-icon btn-ghost relative z-50"
              >
                <Search className="w-5 h-5" />
              </button>
              <SearchModal
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                onNavigate={handleNavigate}
              />
            </div>
          )}

          {/* Notifications - Hidden in mobile preview mode */}
          {!isMobilePreview && (
            <div className="relative">
              <button
                aria-label="Bildirishnomalar"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                  setShowMenu(false);
                  setShowSearch(false);
                }}
                className="btn-icon btn-ghost relative z-50"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationsDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                userName={userProfile.name}
              />
            </div>
          )}

          {/* Theme Toggle - Hidden in mobile preview mode */}
          {!isMobilePreview && (
            <button
              aria-label={
                isDark ? "Yorug'lik rejimiga o'tish" : "Qorong'u rejimga o'tish"
              }
              onClick={() => {
                onThemeToggle();
                closeAllDropdowns();
              }}
              className="btn-icon btn-ghost relative z-50"
              title={
                isDark ? "Yorug'lik rejimga o'tish" : "Qorong'u rejimga o'tish"
              }
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
          )}

          {/* Separator - visible on tablet+, hidden in mobile preview */}
          {!isMobilePreview && (
            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
          )}

          {/* User Profile - Always visible, but simplified in preview mode */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
                setShowMenu(false);
                setShowSearch(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative z-50"
            >
              {/* Avatar */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 ring-2 ring-blue-500/20">
                <span className="text-white text-sm font-semibold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User info - hidden on mobile and in mobile preview mode */}
              {!isMobilePreview && (
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                    {userProfile.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {userProfile.role}
                  </p>
                </div>
              )}

              {/* Dropdown arrow - hidden on mobile and in mobile preview mode */}
              {!isMobilePreview && (
                <ChevronDown className="hidden md:block w-4 h-4 text-slate-400" />
              )}
            </button>

            {!isMobilePreview && (
              <ProfileDropdown
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                onNavigate={onNavigate || (() => {})}
                onLogout={onLogout || (() => {})}
                userProfile={userProfile}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
