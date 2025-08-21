import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Home, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  User,
  Bell,
  ChevronRight,
  Calendar,
  MapPin
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

// Import enhanced mobile screens
import { EnhancedMyDayScreen } from './EnhancedMyDayScreen';
import { EnhancedCheckInScreen } from './EnhancedCheckInScreen';
import { MobileTasksScreen } from './MobileTasksScreen';
import { PenaltiesScreen } from './PenaltiesScreen';
import { ProfileScreen } from './ProfileScreen';

interface EnhancedMobileAppProps {
  onBack: () => void;
  onCheckInSuccess?: () => void;
  attendanceKPIs?: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
}

export function EnhancedMobileApp({ 
  onBack, 
  onCheckInSuccess,
  attendanceKPIs = { present: 12, late: 3, absent: 2, total: 17 }
}: EnhancedMobileAppProps) {
  const [activeScreen, setActiveScreen] = useState<string>('my-day');
  const [notifications] = useState(3);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [localAttendanceKPIs, setLocalAttendanceKPIs] = useState(attendanceKPIs);

  const navigationItems = [
    {
      id: 'my-day',
      label: 'Mening kunim',
      icon: Home,
      badge: null
    },
    {
      id: 'check-in',
      label: 'Davomat',
      icon: Clock,
      badge: null
    },
    {
      id: 'tasks',
      label: 'Vazifalar',
      icon: CheckSquare,
      badge: 5
    },
    {
      id: 'penalties',
      label: 'Balllar',
      icon: AlertTriangle,
      badge: null
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      badge: null
    }
  ];

  // Enhanced check-in handler with animation
  const handleCheckInStart = useCallback(() => {
    setActiveScreen('check-in');
  }, []);

  const handleCheckInSuccess = useCallback(() => {
    setIsCheckingIn(true);
    
    // Update local KPIs immediately for instant feedback
    setLocalAttendanceKPIs(prev => ({
      ...prev,
      present: prev.present + 1,
    }));

    // Show success animation and toast
    toast.success('Davomat muvaffaqiyatli qayd etildi!', {
      duration: 3000,
    });

    // Call parent handler
    onCheckInSuccess?.();

    // Reset check-in state and navigate back
    setTimeout(() => {
      setIsCheckingIn(false);
      setActiveScreen('my-day');
    }, 2000);
  }, [onCheckInSuccess]);

  const handleScreenNavigation = useCallback((screenId: string) => {
    if (screenId === activeScreen) return;
    setActiveScreen(screenId);
  }, [activeScreen]);

  const renderScreen = () => {
    const screenProps = {
      onCheckIn: handleCheckInStart,
      onCheckInSuccess: handleCheckInSuccess,
      attendanceKPIs: localAttendanceKPIs,
      onBack,
    };

    switch (activeScreen) {
      case 'my-day':
        return <EnhancedMyDayScreen {...screenProps} />;
      case 'check-in':
        return <EnhancedCheckInScreen {...screenProps} />;
      case 'tasks':
        return <MobileTasksScreen />;
      case 'penalties':
        return <PenaltiesScreen />;
      case 'profile':
        return <ProfileScreen onBack={onBack} />;
      default:
        return <EnhancedMyDayScreen {...screenProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Mobile Header */}
      <motion.div 
        className="bg-primary text-primary-foreground p-4 pb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/40/40" alt="Alisher Fayzullayev" />
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Alisher Fayzullayev</div>
              <div className="text-sm text-primary-foreground/80">Frontend Developer</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="sm" className="text-primary-foreground relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-5 w-5 p-0 text-xs bg-danger text-danger-foreground">
                      {notifications}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Current Date */}
        <motion.div 
          className="flex items-center space-x-2 text-primary-foreground/90"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            Bugun, {new Date().toLocaleDateString('uz-UZ', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </motion.div>
      </motion.div>

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Check-in Success Overlay */}
      <AnimatePresence>
        {isCheckingIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-success/10 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-background rounded-full p-8 shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-16 h-16 bg-success rounded-full flex items-center justify-center"
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-success-foreground"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
                >
                  <motion.path
                    d="M9 12l2 2 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="grid grid-cols-5 p-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleScreenNavigation(item.id)}
                  className={cn(
                    "flex flex-col items-center space-y-1 h-14 relative transition-all duration-200",
                    isActive && "text-primary"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "transition-all duration-200",
                      isActive && "scale-110"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  </motion.div>
                  
                  <span className={cn(
                    "text-xs transition-all duration-200",
                    isActive && "text-primary font-medium"
                  )}>
                    {item.label}
                  </span>
                  
                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-4 w-4 p-0 text-xs bg-primary text-primary-foreground">
                        {item.badge}
                      </Badge>
                    </motion.div>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}