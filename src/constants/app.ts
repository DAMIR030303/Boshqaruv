/**
 * LocalStorage kalitlari
 *
 * Bu constant'lar localStorage'da saqlanadigan ma'lumotlar
 * uchun kalit nomlarini belgilaydi.
 */
export const LOCAL_STORAGE_KEYS = {
  /** Theme (dark/light) saqlash kaliti */
  THEME: 'boshqaruv-mobile-theme',
  /** Aktiv tab saqlash kaliti */
  ACTIVE_TAB: 'boshqaruv-mobile-active-tab',
  /** Authentication ma'lumotlari saqlash kaliti */
  AUTH: 'boshqaruv-mobile-auth',
} as const;

/**
 * Foydalanuvchi rollari konfiguratsiyasi
 *
 * Bu constant'lar foydalanuvchi rollarini belgilaydi.
 * Sensitive ma'lumotlar yo'q.
 */
export const USER_ROLES = {
  /** Administrator roli */
  ADMIN: 'Administrator',
  /** Manager roli */
  MANAGER: 'Manager',
  /** Xodim roli */
  EMPLOYEE: 'Xodim',
  /** Marketing boshqaruvchisi roli */
  MARKETING: 'Marketing boshqaruvchisi',
} as const;

/**
 * Demo mode indikatori (faqat development uchun)
 *
 * Bu constant development muhitida demo funksiyalarni
 * yoqish/yopish uchun ishlatiladi.
 */
export const IS_DEMO_MODE = import.meta.env.VITE_APP_ENV === 'development';

/**
 * Default foydalanuvchi profili
 *
 * Bu constant default foydalanuvchi profil ma'lumotlarini
 * belgilaydi (fallback uchun).
 */
export const DEFAULT_USER_PROFILE = {
  name: 'Alisher Fayzullayev',
  role: 'Admin',
  avatar: '/api/placeholder/40/40',
  status: 'online',
} as const;

/**
 * Default KPI ma'lumotlari
 *
 * Bu constant ilova boshlanganda ko'rsatiladigan
 * default KPI ma'lumotlarini belgilaydi.
 */
export const DEFAULT_KPI_DATA = {
  attendance: {
    present: 1,
    late: 0,
    absent: 0,
    total: 1,
  },
  tasks: {
    completed: 1,
    inProgress: 2,
    pending: 2,
    total: 5,
  },
  penalties: {
    active: 0,
    resolved: 0,
    total: 0,
  },
} as const;

/**
 * Sahifa sarlavhalari
 *
 * Bu constant har bir tab/sahifa uchun sarlavhalarni
 * belgilaydi. O'zbek tilida.
 */
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

/**
 * Animatsiya konstantalari
 *
 * Bu constant'lar animatsiya duration va delay qiymatlarini
 * belgilaydi. Magic number'larni oldini olish uchun ishlatiladi.
 */
export const ANIMATION = {
  /** Qisqa animatsiya duration (millisekundlarda) */
  DURATION_SHORT: 0.2,
  /** O'rta animatsiya duration (millisekundlarda) */
  DURATION_MEDIUM: 0.3,
  /** Uzoq animatsiya duration (millisekundlarda) */
  DURATION_LONG: 0.5,
  /** Loading spinner animatsiya duration (millisekundlarda) */
  DURATION_SPINNER: 1,
  /** Kichik delay (millisekundlarda) */
  DELAY_SMALL: 0.1,
  /** O'rta delay (millisekundlarda) */
  DELAY_MEDIUM: 0.2,
  /** Katta delay (millisekundlarda) */
  DELAY_LARGE: 0.3,
  /** Juda katta delay (millisekundlarda) */
  DELAY_XLARGE: 0.4,
  /** Ekstra katta delay (millisekundlarda) */
  DELAY_XXLARGE: 0.5,
  /** Minimal delay (millisekundlarda) */
  DELAY_MINIMAL: 0.05,
} as const;

/**
 * Timeout va interval konstantalari
 *
 * Bu constant'lar timeout va interval qiymatlarini
 * belgilaydi. Magic number'larni oldini olish uchun ishlatiladi.
 */
export const TIMING = {
  /** Toast notification duration (millisekundlarda) */
  TOAST_DURATION: 4000,
  /** KPI update interval (millisekundlarda) */
  KPI_UPDATE_INTERVAL: 5000,
  /** Notification check interval (millisekundlarda) */
  NOTIFICATION_CHECK_INTERVAL: 5 * 60 * 1000, // 5 daqiqa
  /** Login lockout duration (millisekundlarda) */
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 daqiqa
  /** Transition duration (millisekundlarda) */
  TRANSITION_DURATION: 200,
} as const;
