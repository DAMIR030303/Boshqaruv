import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';

import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';

interface HeaderProps {
  onMenuClick: () => void;
  userProfile?: {
    name: string;
    role: string;
  };
}

export function Header({ onMenuClick, userProfile }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 md:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - shows only on lg- screens */}
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menyuni ochish</span>
        </button>

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="h-10 w-64 rounded-xl border-none bg-gray-100 pl-10 text-sm outline-none ring-1 ring-transparent focus:bg-white focus:ring-primary dark:bg-gray-800 dark:focus:bg-gray-800 lg:w-80 transition-all"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search Mobile - Icon only */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden">
          <Search className="h-5 w-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
        </button>

        {/* Profile Avatar */}
        {userProfile && (
          <div className="ml-2 flex items-center gap-3">
            <button className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-800 transition-all hover:ring-primary">
              <Avatar name={userProfile.name} size="sm" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
