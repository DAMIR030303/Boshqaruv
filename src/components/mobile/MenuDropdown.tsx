import { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from 'lucide-react';

import { PAGE_TITLES } from '../../constants/app';
import type { UserProfile } from '../../types';

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  userProfile: UserProfile;
  isEmployee?: boolean;
}

/**
 * Menyu dropdown komponenti
 *
 * Bu komponent barcha sahifalarga navigatsiya qilish uchun
 * menyu ko'rsatadi.
 */
export function MenuDropdown({
  isOpen,
  onClose,
  onNavigate,
  userProfile,
  isEmployee = false,
}: MenuDropdownProps) {
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
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape, { capture: true });
      return () =>
        document.removeEventListener('keydown', handleEscape, {
          capture: true,
        });
    }
  }, [isOpen, onClose]);

  // Admin/Manager menyu elementlari
  const adminMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: PAGE_TITLES.dashboard },
    { id: 'employees', icon: Users, label: PAGE_TITLES.employees },
    { id: 'shifts', icon: Calendar, label: PAGE_TITLES.shifts },
    { id: 'tasks', icon: CheckSquare, label: PAGE_TITLES.tasks },
    { id: 'attendance', icon: Clock, label: PAGE_TITLES.attendance },
    { id: 'penalties', icon: AlertCircle, label: PAGE_TITLES.penalties },
    { id: 'reports', icon: FileText, label: PAGE_TITLES.reports },
    { id: 'settings', icon: Settings, label: PAGE_TITLES.settings },
  ];

  // Employee menyu elementlari
  const employeeMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: PAGE_TITLES.dashboard },
    { id: 'tasks', icon: CheckSquare, label: PAGE_TITLES.tasks },
    { id: 'attendance', icon: Clock, label: PAGE_TITLES.attendance },
    { id: 'reports', icon: FileText, label: PAGE_TITLES.reports },
    { id: 'settings', icon: Settings, label: PAGE_TITLES.settings },
  ];

  const menuItems = isEmployee ? employeeMenuItems : adminMenuItems;

  const handleItemClick = (tab: string) => {
    onNavigate(tab);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - High blurring mesh gradient feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40"
          />

          {/* Dropdown - Premium Glass Panel */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, x: -10, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -10, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="absolute left-2 top-full mt-3 w-72 z-50 overflow-hidden rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-blue-900/20 backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90"
          >
            {/* Header with detailed user profile */}
            <div className="relative p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Account
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25 ring-2 ring-white dark:ring-slate-800">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-800 dark:text-white truncate">
                    {userProfile.name}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md inline-block mt-1">
                    {userProfile.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items with modern styling */}
            <div className="p-2 space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/30 transition-all group text-left"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-600 transition-colors shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
