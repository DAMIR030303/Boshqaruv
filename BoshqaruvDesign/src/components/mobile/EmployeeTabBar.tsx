import { motion } from 'framer-motion';
import { 
  Home,
  CheckSquare,
  BarChart3,
  User,
  Calendar,
  MessageSquare,
  Clock
} from 'lucide-react';

interface EmployeeTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  kpiData?: any;
}

export function EmployeeTabBar({ 
  activeTab, 
  onTabChange, 
  kpiData 
}: EmployeeTabBarProps) {
  
  // Employee specific tabs - limited functionality
  const tabs = [
    {
      id: 'dashboard',
      label: 'Bosh',
      icon: Home,
      badge: null,
      hasNotification: false
    },
    {
      id: 'tasks',
      label: 'Vazifalar',
      icon: CheckSquare,
      badge: (kpiData?.tasks?.pending || 0) > 0 ? kpiData.tasks.pending : null,
      hasNotification: (kpiData?.tasks?.pending || 0) > 0
    },
    {
      id: 'attendance',
      label: 'Davomat',
      icon: Clock,
      badge: null,
      hasNotification: false
    },
    {
      id: 'reports',
      label: 'Hisobotlar',
      icon: BarChart3,
      badge: null,
      hasNotification: false
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      badge: null,
      hasNotification: false
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
                        layoutId="employeeActiveBackground"
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
                        {tab.hasNotification && tab.badge && tab.badge > 0 && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute -top-3 -right-3"
                          >
                            <div className="relative">
                              <div className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold 
                                            bg-danger text-danger-foreground rounded-full
                                            animate-pulse shadow-lg shadow-danger/30 border-2 border-background">
                                {tab.badge > 9 ? '9+' : tab.badge}
                              </div>
                              {/* Pulsing ring */}
                              <div className="absolute inset-0 rounded-full border-2 border-danger animate-ping opacity-20" />
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Simple count dot */}
                        {!tab.hasNotification && tab.badge && tab.badge > 0 && (
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
                      layoutId="employeeActiveIndicator"
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
    </motion.div>
  );
}