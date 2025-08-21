import { useState, useCallback, useEffect, useRef } from 'react';
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
  Calendar,
  Smartphone
} from 'lucide-react';
import { cn } from '../ui/utils';

// Import enhanced mobile screens
import { EnhancedMyDayScreen } from './EnhancedMyDayScreen';
import { EnhancedCheckInScreen } from './EnhancedCheckInScreen';
import { MobileTasksScreen } from './MobileTasksScreen';
import { PenaltiesScreen } from './PenaltiesScreen';
import { ProfileScreen } from './ProfileScreen';

interface MobileAppProps {
  onBack: () => void;
  onCheckInSuccess?: () => void;
  attendanceKPIs?: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
}

export function MobileApp({ 
  onBack, 
  onCheckInSuccess,
  attendanceKPIs = { present: 12, late: 3, absent: 2, total: 17 }
}: MobileAppProps) {
  const [activeScreen, setActiveScreen] = useState<string>('my-day');
  const [notifications] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Refs for accessibility
  const navigationRef = useRef<HTMLDivElement>(null);
  const screenContentRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    {
      id: 'my-day',
      label: 'Mening kunim',
      icon: Home,
      badge: null,
      ariaLabel: 'Mening kunim sahifasiga o\'tish'
    },
    {
      id: 'check-in',
      label: 'Davomat',
      icon: Clock,
      badge: null,
      ariaLabel: 'Davomat sahifasiga o\'tish'
    },
    {
      id: 'tasks',
      label: 'Vazifalar',
      icon: CheckSquare,
      badge: 5,
      ariaLabel: 'Vazifalar sahifasiga o\'tish (5 ta yangi vazifa)'
    },
    {
      id: 'penalties',
      label: 'Balllar',
      icon: AlertTriangle,
      badge: null,
      ariaLabel: 'Balllar sahifasiga o\'tish'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      badge: null,
      ariaLabel: 'Profil sahifasiga o\'tish'
    }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && navigationRef.current?.contains(event.target as Node)) {
        // Ensure proper tab navigation within the navigation bar
        const focusableElements = navigationRef.current.querySelectorAll('button');
        const currentIndex = Array.from(focusableElements).indexOf(event.target as HTMLButtonElement);
        
        if (event.shiftKey && currentIndex === 0) {
          event.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        } else if (!event.shiftKey && currentIndex === focusableElements.length - 1) {
          event.preventDefault();
          focusableElements[0].focus();
        }
      }

      // Handle screen navigation with arrow keys
      if (['ArrowLeft', 'ArrowRight'].includes(event.key) && navigationRef.current?.contains(event.target as Node)) {
        event.preventDefault();
        const currentIndex = navigationItems.findIndex(item => item.id === activeScreen);
        let newIndex;
        
        if (event.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : navigationItems.length - 1;
        } else {
          newIndex = currentIndex < navigationItems.length - 1 ? currentIndex + 1 : 0;
        }
        
        handleScreenNavigation(navigationItems[newIndex].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen]);

  const handleCheckInStart = useCallback(() => {
    setActiveScreen('check-in');
  }, []);

  const handleCheckInSuccess = useCallback(() => {
    onCheckInSuccess?.();
    setActiveScreen('my-day');
  }, [onCheckInSuccess]);

  const handleScreenNavigation = useCallback((screenId: string) => {
    if (screenId === activeScreen || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Announce screen change to screen readers
    const screenName = navigationItems.find(item => item.id === screenId)?.label || screenId;
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${screenName} sahifasiga o'tildi`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      setActiveScreen(screenId);
      setIsTransitioning(false);
      
      // Focus the main content area after navigation
      if (screenContentRef.current) {
        screenContentRef.current.focus();
      }
      
      // Clean up announcement
      document.body.removeChild(announcement);
    }, 150);
  }, [activeScreen, isTransitioning, navigationItems]);

  const renderScreen = () => {
    const screenProps = {
      onCheckIn: handleCheckInStart,
      onCheckInSuccess: handleCheckInSuccess,
      attendanceKPIs,
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
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Mobile Header */}
      <header className="bg-primary text-primary-foreground p-4 pb-6" role="banner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/40/40" alt="Alisher Fayzullayev profil rasmi" />
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Alisher Fayzullayev</div>
              <div className="text-sm text-primary-foreground/80">Frontend Developer</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground relative"
              aria-label={`Bildirishnomalar (${notifications} ta yangi)`}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-danger text-danger-foreground"
                  aria-label={`${notifications} ta yangi bildirishnoma`}
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Current Date */}
        <div className="flex items-center space-x-2 text-primary-foreground/90">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">
            Bugun, {new Date().toLocaleDateString('uz-UZ', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </header>

      {/* Screen Content */}
      <main 
        className="flex-1 overflow-y-auto pb-20"
        role="main"
        ref={screenContentRef}
        tabIndex={-1}
        aria-label={`${navigationItems.find(item => item.id === activeScreen)?.label || 'Asosiy'} kontenti`}
      >
        <div className={cn(
          "transition-opacity duration-150",
          isTransitioning ? "opacity-50" : "opacity-100"
        )}>
          {renderScreen()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border"
        role="tablist"
        aria-label="Asosiy navigatsiya"
        ref={navigationRef}
      >
        <div className="grid grid-cols-5 p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                role="tab"
                aria-selected={isActive}
                aria-controls={`screen-${item.id}`}
                aria-label={item.ariaLabel}
                onClick={() => handleScreenNavigation(item.id)}
                disabled={isTransitioning}
                className={cn(
                  "flex flex-col items-center space-y-1 h-14 relative",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isActive && "text-primary",
                  isTransitioning && "opacity-50"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} aria-hidden="true" />
                <span className={cn(
                  "text-xs",
                  isActive && "text-primary font-medium"
                )}>
                  {item.label}
                </span>
                {item.badge && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-primary text-primary-foreground"
                    aria-label={`${item.badge} ta yangi element`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isTransitioning && 'Sahifa yuklanmoqda...'}
      </div>
    </div>
  );
}