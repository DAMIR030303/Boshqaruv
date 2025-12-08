import { useCallback } from 'react';

import {
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  CheckSquare,
  Clock,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from 'lucide-react';

import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  userProfile?: {
    name: string;
    role: string;
  };
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Boshqaruv paneli' },
  { id: 'employees', icon: Users, label: 'Xodimlar' },
  { id: 'shifts', icon: Clock, label: 'Smenalar' },
  { id: 'tasks', icon: CheckSquare, label: 'Vazifalar' },
  { id: 'attendance', icon: Calendar, label: 'Davomat' },
  { id: 'reports', icon: BarChart3, label: 'Hisobotlar' },
  { id: 'penalties', icon: AlertTriangle, label: 'Jarimalar' },
  { id: 'settings', icon: Settings, label: 'Sozlamalar' },
];

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  userProfile,
}: SidebarProps) {
  const handleNavigate = useCallback(
    (id: string) => {
      onNavigate(id);
      if (onClose) onClose();
    },
    [onNavigate, onClose]
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              IshOqimi
            </span>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Yopish</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section (Bottom) */}
        {userProfile && (
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 p-3 hover:bg-sidebar-accent/50 transition-colors cursor-pointer group">
              <Avatar name={userProfile.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
                  {userProfile.name}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {userProfile.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
