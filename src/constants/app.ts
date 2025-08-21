// App constants
export const LOCAL_STORAGE_KEYS = {
  THEME: 'boshqaruv-mobile-theme',
  ACTIVE_TAB: 'boshqaruv-mobile-active-tab',
  AUTH: 'boshqaruv-mobile-auth'
} as const;

export const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
  { username: 'manager', password: 'manager123' },
  { username: 'user', password: 'user123' },
  { username: 'marketolog', password: 'marketing123' }
] as const;

export const USER_PROFILES = {
  admin: {
    name: 'Alisher Fayzullayev',
    role: 'Administrator' as const,
    avatar: '/api/placeholder/40/40',
    status: 'online' as const
  },
  manager: {
    name: 'Nargiza Karimova',
    role: 'Manager' as const,
    avatar: '/api/placeholder/40/40',
    status: 'online' as const
  },
  user: {
    name: 'Javohir Tursunov',
    role: 'Xodim' as const,
    avatar: '/api/placeholder/40/40',
    status: 'online' as const
  },
  marketolog: {
    name: 'Shaxriddin Adizov Sherali o\'g\'li',
    role: 'Marketing boshqaruvchisi' as const,
    avatar: '/api/placeholder/40/40',
    status: 'online' as const
  }
} as const;

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
