import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Home,
  Users,
  Calendar,
  CheckSquare,
  Clock,
  AlertTriangle,
  BarChart3,
  Settings,
  User,
  Plus
} from 'lucide-react';

interface MobileTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  kpiData: {
    attendance: {
      present: number;
      late: number;
      absent: number;
      total: number;
    };
    tasks: {
      completed: number;
      inProgress: number;
      pending: number;
      total: number;
    };
    penalties: {
      active: number;
      resolved: number;
      total: number;
    };
  };
}

export function MobileTabBar({ activeTab, onTabChange, kpiData }: MobileTabBarProps) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Bosh',
      icon: Home,
      hasNotification: false,
      count: null
    },
    {
      id: 'employees',
      label: 'Xodimlar',
      icon: Users,
      hasNotification: false,
      count: null
    },
    {
      id: 'attendance',
      label: 'Davomat',
      icon: Clock,
      hasNotification: kpiData.attendance.late > 0,
      count: kpiData.attendance.late || null
    },
    {
      id: 'tasks',
      label: 'Vazifalar',
      icon: CheckSquare,
      hasNotification: kpiData.tasks.pending > 0,
      count: (kpiData.tasks.pending + kpiData.tasks.inProgress) || null
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      hasNotification: false,
      count: null
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Background with blur effect */}
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="boshqaruv-container">
          <nav className="flex items-center justify-around py-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  {/* Main Tab Button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      relative flex flex-col items-center justify-center
                      h-16 w-16 rounded-3xl transition-all duration-500 ease-out
                      ${isActive 
                        ? 'bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-br hover:from-muted/30 hover:to-muted/10 active:bg-muted/50'
                      }
                    `}
                    onClick={() => onTabChange(tab.id)}
                  >
                    {/* Ripple Effect Background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBackground"
                        className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                      />
                    )}
                    
                    {/* Icon Container */}
                    <div className="relative z-10">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          rotate: isActive ? [0, -3, 3, 0] : 0
                        }}
                        transition={{ 
                          duration: 0.4,
                          rotate: { repeat: isActive ? Infinity : 0, duration: 2 }
                        }}
                        className="relative"
                      >
                        <Icon className={`h-6 w-6 transition-all duration-300 ${
                          isActive ? 'drop-shadow-sm' : ''
                        }`} />
                        
                        {/* Notification Indicator */}
                        {tab.hasNotification && tab.count && tab.count > 0 && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute -top-3 -right-3"
                          >
                            <div className="relative">
                              <Badge 
                                variant="destructive" 
                                className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold 
                                          animate-pulse shadow-lg shadow-danger/30 border-2 border-background"
                              >
                                {tab.count > 9 ? '9+' : tab.count}
                              </Badge>
                              {/* Pulsing ring */}
                              <div className="absolute inset-0 rounded-full border-2 border-danger animate-ping opacity-20" />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Simple count dot */}
                        {!tab.hasNotification && tab.count && tab.count > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Glowing effect for active tab */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 blur-md"
                      />
                    )}
                  </motion.button>
                  
                  {/* Label below button */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.7, 
                      y: 0,
                      scale: isActive ? 1.05 : 1
                    }}
                    transition={{ delay: 0.1 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className={`text-xs font-medium transition-all duration-300 px-2 py-1 rounded-full ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.div>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg shadow-primary/50"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Enhanced Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="absolute -top-8 right-6"
      >
        <motion.button
          whileTap={{ scale: 0.85, rotate: 15 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary via-primary to-primary/80 
                     hover:from-primary/90 hover:to-primary/70 border-4 border-background
                     flex items-center justify-center group relative overflow-hidden"
          onClick={() => onTabChange('tasks')}
        >
          {/* Background glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 blur-xl scale-150 opacity-50" />
          
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Plus className="h-6 w-6 text-primary-foreground drop-shadow-md" />
          </motion.div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
        </motion.button>
        
        {/* Action label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            Vazifa yaratish
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}