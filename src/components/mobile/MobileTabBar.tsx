import React from 'react';
import { motion } from 'framer-motion';
import { IconButton } from '../ui/IconButton';
import { Home, Users, Clock, CheckSquare, Calendar, AlertTriangle, BarChart3, Settings, User } from 'lucide-react';
import type { UserProfile } from '../../types';

interface MobileTabBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  userProfile: UserProfile;
}

export function MobileTabBar({ activeTab, onNavigate, userProfile }: MobileTabBarProps) {
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

  return (
    <nav className="mobile-tab-bar">
      <div className="relative flex items-center justify-between px-2">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCenter = idx === 0; // we'll overlay floating home; keep regular items too
          return (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-2 h-2 bg-primary-500 rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
        {/* Floating Home Button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border bg-white dark:bg-gray-900 ${
            activeTab === 'dashboard' ? 'border-primary-500 text-primary-600' : 'border-gray-200 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
