import * as React from 'react';
import { cn } from './utils';

// Boshqaruv Accessibility Utilities
// WCAG AA compliant helper components and hooks

/**
 * Skip Link Component
 * Allows keyboard users to skip to main content
 */
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible on focus
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50',
        'bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  );
};

/**
 * Visually Hidden Component
 * Hides content visually but keeps it available to screen readers
 */
interface VisuallyHiddenProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ 
  children, 
  asChild = false 
}) => {
  const Component = asChild ? React.Fragment : 'span';
  
  return (
    <Component className={asChild ? undefined : 'sr-only'}>
      {children}
    </Component>
  );
};

/**
 * Focus Trap Hook
 * Traps focus within a container (useful for modals, dialogs)
 */
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef]);
};

/**
 * Live Region Component
 * Announces dynamic content changes to screen readers
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'all',
  className
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
};

/**
 * Landmark Component
 * Creates semantic landmarks for better navigation
 */
interface LandmarkProps {
  children: React.ReactNode;
  role: 'banner' | 'main' | 'navigation' | 'contentinfo' | 'complementary' | 'search';
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}

export const Landmark: React.FC<LandmarkProps> = ({
  children,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
  ...props
}) => {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Keyboard Navigation Hook
 * Handles common keyboard navigation patterns
 */
export const useKeyboardNavigation = (
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical' | 'both';
  } = {}
) => {
  const { loop = true, orientation = 'both' } = options;

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    const currentIndex = items.findIndex(item => item === document.activeElement);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';
    const isVertical = orientation === 'vertical' || orientation === 'both';

    switch (e.key) {
      case 'ArrowRight':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = loop ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          e.preventDefault();
          newIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'ArrowDown':
        if (isVertical) {
          e.preventDefault();
          newIndex = loop ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          e.preventDefault();
          newIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      items[newIndex]?.focus();
    }
  }, [items, loop, orientation]);

  return { handleKeyDown };
};

/**
 * Announce to Screen Reader Hook
 * Programmatically announce messages to screen readers
 */
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = React.useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(''); // Clear first to ensure re-announcement
    setTimeout(() => setAnnouncement(message), 100);
  }, []);

  const AnnouncementRegion = React.useCallback(() => (
    <LiveRegion politeness="assertive">
      {announcement}
    </LiveRegion>
  ), [announcement]);

  return { announce, AnnouncementRegion };
};

/**
 * High Contrast Detection Hook
 * Detects if user prefers high contrast mode
 */
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
};

/**
 * Reduced Motion Detection Hook
 * Respects user's motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Uzbek Language Screen Reader Text
export const UzbekScreenReaderText = {
  // Navigation
  mainNavigation: 'Asosiy navigatsiya',
  skipToMainContent: 'Asosiy kontentga o\'tish',
  skipToNavigation: 'Navigatsiyaga o\'tish',
  
  // Actions  
  close: 'Yopish',
  open: 'Ochish',
  save: 'Saqlash',
  cancel: 'Bekor qilish',
  delete: 'O\'chirish',
  edit: 'Tahrirlash',
  
  // States
  loading: 'Yuklanmoqda',
  error: 'Xatolik',
  success: 'Muvaffaqiyatli',
  required: 'Majburiy maydon',
  
  // Form
  showPassword: 'Parolni ko\'rsatish',
  hidePassword: 'Parolni yashirish',
  invalidEmail: 'Email manzil noto\'g\'ri',
  fieldRequired: 'Bu maydon majburiy',
  
  // Pagination
  previousPage: 'Oldingi sahifa',
  nextPage: 'Keyingi sahifa',
  currentPage: 'Joriy sahifa',
  
  // Sort and Filter
  sortAscending: 'O\'sish tartibida saralash',
  sortDescending: 'Kamayish tartibida saralash',
  filterResults: 'Natijalarni filtrlash',
  clearFilters: 'Filtrlarnі tozalash',
};