import { useState } from 'react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckSquare, 
  Calendar,
  AlertTriangle,
  FileText,
  Settings,
  Eye,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemSelect: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  restricted?: boolean;
}

const mainMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Boshqaruv paneli',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: 'xodimlar',
    label: 'Xodimlar',
    icon: <Users className="h-5 w-5" />,
    badge: '17',
    badgeVariant: 'secondary'
  },
  {
    id: 'smenalar',
    label: 'Smenalar',
    icon: <Clock className="h-5 w-5" />,
    badge: '8',
    badgeVariant: 'secondary'
  },
  {
    id: 'vazifalar',
    label: 'Vazifalar',
    icon: <CheckSquare className="h-5 w-5" />,
    badge: '24',
    badgeVariant: 'secondary'
  },
  {
    id: 'davomat',
    label: 'Davomat',
    icon: <Calendar className="h-5 w-5" />,
    badge: '3',
    badgeVariant: 'warning'
  },
  {
    id: 'jarimalar',
    label: 'Jarimalar',
    icon: <AlertTriangle className="h-5 w-5" />,
    badge: '3',
    badgeVariant: 'warning'
  },
  {
    id: 'hisobotlar',
    label: 'Hisobotlar',
    icon: <FileText className="h-5 w-5" />,
  }
];

const systemMenuItems: MenuItem[] = [
  {
    id: 'sozlamalar',
    label: 'Sozlamalar',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    id: 'audit',
    label: 'Audit',
    icon: <Eye className="h-5 w-5" />,
    badge: '248',
    badgeVariant: 'secondary'
  }
];

const adminMenuItems: MenuItem[] = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    icon: <Shield className="h-5 w-5" />,
    badge: 'Maxfiy',
    badgeVariant: 'danger',
    restricted: true
  }
];

const bottomMenuItems: MenuItem[] = [
  {
    id: 'help',
    label: 'Yordam',
    icon: <HelpCircle className="h-5 w-5" />,
  }
];

export function Sidebar({ isOpen, onToggle, activeItem, onItemSelect }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole] = useState('Super Admin'); // This would come from auth context

  const getBadgeVariant = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'danger':
        return 'bg-danger text-danger-foreground';
      default:
        return 'secondary';
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    // Hide restricted items for non-admin users
    if (item.restricted && userRole !== 'Super Admin') {
      return null;
    }

    return (
      <Button
        key={item.id}
        variant={activeItem === item.id ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start h-11 px-3",
          activeItem === item.id && "bg-primary text-primary-foreground hover:bg-primary/90",
          isCollapsed && "justify-center px-0"
        )}
        onClick={() => onItemSelect(item.id)}
      >
        {item.icon}
        {!isCollapsed && (
          <>
            <span className="ml-3 truncate">{item.label}</span>
            {item.badge && (
              <Badge 
                className={cn("ml-auto text-xs", getBadgeVariant(item.badgeVariant))}
                variant={item.badgeVariant === 'secondary' ? 'secondary' : 'default'}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 desktop:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 desktop:relative desktop:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">B</span>
                </div>
                <span className="font-semibold text-sidebar-foreground">Boshqaruv</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              {/* Collapse Toggle - Desktop only */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden desktop:flex"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>

              {/* Close button - Mobile only */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="desktop:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {/* Main Menu */}
              <div className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                    Asosiy
                  </div>
                )}
                {mainMenuItems.map(renderMenuItem)}
              </div>

              <Separator className="my-4 mx-3" />

              {/* System Menu */}
              <div className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                    Tizim
                  </div>
                )}
                {systemMenuItems.map(renderMenuItem)}
              </div>

              {/* Admin Menu - Only show if user has access */}
              {userRole === 'Super Admin' && (
                <>
                  <Separator className="my-4 mx-3" />
                  <div className="space-y-1">
                    {!isCollapsed && (
                      <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                        Admin
                      </div>
                    )}
                    {adminMenuItems.map(renderMenuItem)}
                  </div>
                </>
              )}
            </nav>
          </ScrollArea>

          {/* Bottom Menu */}
          <div className="p-3 border-t border-sidebar-border">
            <nav className="space-y-1">
              {bottomMenuItems.map(renderMenuItem)}
            </nav>
          </div>

          {/* User Info - if not collapsed */}
          {!isCollapsed && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">
                    Admin User
                  </div>
                  <div className="text-xs text-sidebar-foreground/60 truncate">
                    {userRole}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer - if not collapsed */}
          {!isCollapsed && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="text-xs text-sidebar-foreground/60 text-center">
                Boshqaruv v1.0.0
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}