import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import type { UserProfile } from '../../types';

interface MobileHeaderProps {
  userProfile: UserProfile;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function MobileHeader({ userProfile, isDark, onThemeToggle }: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search functionality will be implemented in future version
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <header className="mobile-header backdrop-blur-md bg-white/70 dark:bg-gray-900/60">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-3">
          <IconButton aria-label="Menyu">
            <Menu className="w-5 h-5" />
          </IconButton>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
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
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Boshqaruv
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <IconButton aria-label="Qidirish" onClick={() => setShowSearch(!showSearch)}>
            <Search className="w-5 h-5" />
          </IconButton>

          {/* Notifications */}
          <div className="relative">
            <IconButton aria-label="Bildirishnomalar">
              <Bell className="w-5 h-5" />
            </IconButton>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>

          {/* Theme Toggle */}
          <IconButton aria-label="Mavzuni almashtirish" onClick={onThemeToggle}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </IconButton>

          {/* User Profile */}
          <motion.div
            className="flex items-center space-x-2 p-2 rounded-xl bg-white/70 dark:bg-gray-800/60 backdrop-blur-md hover:shadow-md transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userProfile.name.charAt(0)}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userProfile.role}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qidirish..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
