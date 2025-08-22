/**
 * Accessibility utilities for better UX
 */

/**
 * ARIA labels for common UI elements in Uzbek
 */
export const ARIA_LABELS = {
  // Navigation
  mainMenu: 'Asosiy menyu',
  userMenu: 'Foydalanuvchi menyusi',
  search: 'Qidiruv',
  notifications: 'Bildirishnomalar',
  settings: 'Sozlamalar',
  
  // Actions
  close: 'Yopish',
  open: 'Ochish',
  save: 'Saqlash',
  cancel: 'Bekor qilish',
  delete: 'O\'chirish',
  edit: 'Tahrirlash',
  add: 'Qo\'shish',
  remove: 'Olib tashlash',
  
  // Forms
  required: 'Majburiy maydon',
  optional: 'Ixtiyoriy maydon',
  error: 'Xatolik',
  success: 'Muvaffaqiyatli',
  loading: 'Yuklanmoqda',
  
  // Tables
  sortAscending: 'O\'sish tartibida saralash',
  sortDescending: 'Kamayish tartibida saralash',
  selectAll: 'Barchasini tanlash',
  selectRow: 'Qatorni tanlash',
  
  // Pagination
  previousPage: 'Oldingi sahifa',
  nextPage: 'Keyingi sahifa',
  firstPage: 'Birinchi sahifa',
  lastPage: 'Oxirgi sahifa',
  pageNumber: (page: number) => `${page}-sahifa`,
  
  // Status
  online: 'Onlayn',
  offline: 'Oflayn',
  busy: 'Band',
  away: 'Uzoqda',
  
  // Roles
  admin: 'Administrator',
  manager: 'Menejer',
  employee: 'Xodim',
  marketing: 'Marketing boshqaruvchisi',
} as const;

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * Handle keyboard navigation for lists
 */
export const handleListKeyNavigation = (
  event: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void
): void => {
  switch (event.key) {
    case KeyboardKeys.ARROW_DOWN:
      event.preventDefault();
      onSelect(Math.min(currentIndex + 1, totalItems - 1));
      break;
    case KeyboardKeys.ARROW_UP:
      event.preventDefault();
      onSelect(Math.max(currentIndex - 1, 0));
      break;
    case KeyboardKeys.HOME:
      event.preventDefault();
      onSelect(0);
      break;
    case KeyboardKeys.END:
      event.preventDefault();
      onSelect(totalItems - 1);
      break;
  }
};

/**
 * Focus trap for modals and dialogs
 */
export const createFocusTrap = (containerElement: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} => {
  const focusableElements = containerElement.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== KeyboardKeys.TAB) return;
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement?.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement?.focus();
      }
    }
  };
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === KeyboardKeys.ESCAPE) {
      deactivate();
    }
  };
  
  const activate = () => {
    containerElement.addEventListener('keydown', handleTabKey);
    containerElement.addEventListener('keydown', handleEscapeKey);
    firstFocusableElement?.focus();
  };
  
  const deactivate = () => {
    containerElement.removeEventListener('keydown', handleTabKey);
    containerElement.removeEventListener('keydown', handleEscapeKey);
  };
  
  return { activate, deactivate };
};

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Get contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const sRGB = parseInt(c) / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG standards
 */
export const meetsWCAGContrast = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  fontSize: 'normal' | 'large' = 'normal'
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AA') {
    return fontSize === 'large' ? ratio >= 3 : ratio >= 4.5;
  } else {
    return fontSize === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
};

/**
 * Debounce function for reducing motion
 */
export const reduceMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get user's color scheme preference
 */
export const getColorSchemePreference = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Format time for screen readers
 */
export const formatTimeForScreenReader = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} kun oldin`;
  } else if (hours > 0) {
    return `${hours} soat oldin`;
  } else if (minutes > 0) {
    return `${minutes} daqiqa oldin`;
  } else {
    return 'Hozirgina';
  }
};

/**
 * Skip to main content link helper
 */
export const createSkipLink = (): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-primary-600 px-4 py-2 rounded-md z-50';
  skipLink.textContent = 'Asosiy kontentga o\'tish';
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  });
  
  return skipLink;
};