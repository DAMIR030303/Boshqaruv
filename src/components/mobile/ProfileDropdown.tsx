import { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Settings, User } from 'lucide-react';

import type { UserProfile } from '../../types';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  userProfile: UserProfile;
}

/**
 * Profil dropdown komponenti
 *
 * Bu komponent profil va sozlamalar sahifalariga o'tish
 * va logout funksiyasini ta'minlaydi.
 */
export function ProfileDropdown({
  isOpen,
  onClose,
  onNavigate,
  onLogout,
  userProfile,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleProfileClick = () => {
    onNavigate('profile');
    onClose();
  };

  const handleSettingsClick = () => {
    onNavigate('settings');
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20"
          />

          {/* Dropdown */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-30 overflow-hidden"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-medium">
                    {userProfile.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userProfile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userProfile.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 bg-white dark:bg-slate-800">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Profil
                </span>
              </button>

              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Sozlamalar
                </span>
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-red-500 dark:text-red-400" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Chiqish
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
