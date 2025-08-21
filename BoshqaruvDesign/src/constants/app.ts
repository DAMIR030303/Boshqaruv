// Application-wide constants used across the mobile app
import type { UserProfile } from '../utils/auth';
import type { KPIData } from '../utils/kpi';

export const LOCAL_STORAGE_KEYS = {
  THEME: 'boshqaruv:theme',
  AUTH: 'boshqaruv:isLoggedIn',
  ACTIVE_TAB: 'boshqaruv:activeTab',
} as const;

export const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
  { username: 'manager', password: 'manager123' },
  { username: 'user', password: 'user123' },
  { username: 'marketolog', password: 'marketing123' },
] as const;

export const USER_PROFILES: Record<string, UserProfile> = {
  admin: {
    name: 'Alisher Fayzullayev',
    role: 'Administrator',
    avatar: '/api/placeholder/40/40',
    status: 'online',
  },
  manager: {
    name: 'Nargiza Karimova',
    role: 'Manager',
    avatar: '/api/placeholder/40/40',
    status: 'online',
  },
  user: {
    name: 'Javohir Tursunov',
    role: 'Xodim',
    avatar: '/api/placeholder/40/40',
    status: 'online',
  },
  marketolog: {
    name: "Shaxriddin Adizov Sherali o'g'li",
    role: 'Marketing boshqaruvchisi',
    avatar: '/api/placeholder/40/40',
    status: 'online',
  },
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Foydalanuvchi',
  role: 'Mehmon',
  avatar: '/api/placeholder/40/40',
  status: 'offline',
};

export const DEFAULT_KPI_DATA: KPIData = {
  attendance: { present: 12, late: 3, absent: 2, total: 17 },
  tasks: { completed: 25, inProgress: 7, pending: 5, total: 37 },
  penalties: { active: 2, resolved: 5, total: 7 },
};

export const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Bosh sahifa',
  employees: 'Xodimlar',
  shifts: 'Smenalar',
  tasks: 'Vazifalar',
  attendance: 'Davomat',
  penalties: 'Jarimalar',
  reports: 'Hisobotlar',
  settings: 'Sozlamalar',
  profile: 'Profil',
} as const;