// App constants
export const LOCAL_STORAGE_KEYS = {
  THEME: 'boshqaruv-mobile-theme',
  ACTIVE_TAB: 'boshqaruv-mobile-active-tab',
  AUTH: 'boshqaruv-mobile-auth'
} as const;

// User roles configuration (no sensitive data)
export const USER_ROLES = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  EMPLOYEE: 'Xodim',
  MARKETING: 'Marketing boshqaruvchisi'
} as const;

// Demo mode indicator (for development only)
export const IS_DEMO_MODE = import.meta.env.VITE_APP_ENV === 'development';

export const DEFAULT_USER_PROFILE = {
  name: 'Alisher Fayzullayev',
  role: 'Admin',
  avatar: '/api/placeholder/40/40',
  status: 'online'
} as const;

export const DEFAULT_KPI_DATA = {
  attendance: {
    present: 1,
    late: 0,
    absent: 0,
    total: 1
  },
  tasks: {
    completed: 1,
    inProgress: 2,
    pending: 2,
    total: 5
  },
  penalties: {
    active: 0,
    resolved: 0,
    total: 0
  }
} as const;

export const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Bosh sahifa',
  employees: 'Xodimlar',
  shifts: 'Smenalar', 
  tasks: 'Vazifalar',
  attendance: 'Davomat',
  penalties: 'Jarimalar',
  reports: 'Hisobotlar',
  settings: 'Sozlamalar',
  profile: 'Profil'
} as const;
