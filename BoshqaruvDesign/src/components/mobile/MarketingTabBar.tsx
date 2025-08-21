import { motion } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  User,
  Activity
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface MarketingTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  kpiData?: any;
}

export function MarketingTabBar({ activeTab, onTabChange, kpiData }: MarketingTabBarProps) {
  const tabs = [
    { 
      id: 'dashboard', 
      icon: Activity, 
      label: 'Figma',
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    },
    { 
      id: 'tasks', 
      icon: CheckSquare, 
      label: 'Vazifalar',
      badge: kpiData?.tasks?.pending > 0 ? kpiData.tasks.pending : undefined,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      id: 'attendance', 
      icon: Calendar, 
      label: 'Davomat',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
    { 
      id: 'reports', 
      icon: BarChart3, 
      label: 'Hisobotlar',
      color: 'text-green-600',
      bgColor: 'bg-green-600/10'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Sozlamalar',
      color: 'text-slate-600',
      bgColor: 'bg-slate-600/10'
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profil',
      color: 'text-orange-600',
      bgColor: 'bg-orange-600/10'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[50px] p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'scale-105' : 'scale-100 hover:scale-105'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background highlight for active tab */}
              {isActive && (
                <motion.div
                  layoutId="marketing-tab-highlight"
                  className={`absolute inset-0 ${tab.bgColor} rounded-xl`}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
              
              {/* Icon and badge container */}
              <div className="relative">
                <Icon 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isActive ? tab.color : 'text-muted-foreground'
                  }`} 
                />
                
                {/* Badge for notifications */}
                {tab.badge && tab.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge 
                      variant="destructive" 
                      className="h-5 w-5 text-xs flex items-center justify-center p-0 rounded-full"
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Badge>
                  </motion.div>
                )}
              </div>
              
              {/* Label */}
              <span 
                className={`text-xs mt-1 transition-colors duration-200 ${
                  isActive ? tab.color : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="marketing-active-indicator"
                  className={`absolute -bottom-1 w-1 h-1 ${tab.color.replace('text-', 'bg-')} rounded-full`}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}