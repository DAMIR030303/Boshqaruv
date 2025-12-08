/**
 * Foydalanuvchi profil ma'lumotlari
 */
export interface UserProfile {
  /** Foydalanuvchi unique ID */
  id?: string;
  /** Foydalanuvchi to'liq ismi */
  name: string;
  /** Foydalanuvchi roli */
  role: 'Administrator' | 'Manager' | 'Xodim' | 'Marketing boshqaruvchisi';
  /** Avatar rasmi URL */
  avatar: string;
  /** Foydalanuvchi holati */
  status: 'online' | 'offline';
}

/**
 * Login ma'lumotlari
 */
export interface LoginCredentials {
  /** Foydalanuvchi nomi */
  username: string;
  /** Parol */
  password: string;
}

/**
 * KPI (Key Performance Indicators) ma'lumotlari
 *
 * Bu interface davomat, vazifalar va jarimalar statistikasini
 * saqlash uchun ishlatiladi.
 */
export interface KPIData {
  /** Davomat statistikasi */
  attendance: {
    /** Kelgan xodimlar soni */
    present: number;
    /** Kechikkan xodimlar soni */
    late: number;
    /** Kelmagan xodimlar soni */
    absent: number;
    /** Jami xodimlar soni */
    total: number;
  };
  /** Vazifalar statistikasi */
  tasks: {
    /** Bajarilgan vazifalar soni */
    completed: number;
    /** Jarayondagi vazifalar soni */
    inProgress: number;
    /** Kutilayotgan vazifalar soni */
    pending: number;
    /** Jami vazifalar soni */
    total: number;
  };
  /** Jarimalar statistikasi */
  penalties: {
    /** Faol jarimalar soni */
    active: number;
    /** Hal qilingan jarimalar soni */
    resolved: number;
    /** Jami jarimalar soni */
    total: number;
  };
}

/**
 * Vazifa ma'lumotlari
 */
export interface Task {
  /** Vazifa ID */
  id: string;
  /** Vazifa nomi */
  title: string;
  /** Vazifa tavsifi */
  description: string;
  /** Mas'ul shaxs */
  assignee: string;
  /** Vazifa holati */
  status: 'pending' | 'in-progress' | 'completed';
  /** Vazifa prioriteti */
  priority: 'low' | 'medium' | 'high';
  /** Muddati */
  dueDate: Date;
  /** Yaratilgan sana */
  createdAt: Date;
  /** Yangilangan sana */
  updatedAt: Date;
}

/**
 * Davomat ma'lumotlari
 */
export interface Attendance {
  id: string;
  employeeId: string;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'late' | 'absent';
  location?: string;
  notes?: string;
}

// Employee types
export interface Employee {
  id: string;
  name: string;
  position: string;
  avatar: string;
  status: 'online' | 'offline';
  department: string;
  email: string;
  phone: string;
}

// Shift types
export interface Shift {
  id: string;
  employeeId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  type: 'morning' | 'afternoon' | 'night';
}

// Penalty types
export interface Penalty {
  id: string;
  employeeId: string;
  type: string;
  amount: number;
  reason: string;
  status: 'active' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

// Marketing content types (for Shaxriddin)
export interface MarketingContent {
  id: string;
  type: 'instagram_post' | 'video' | 'article';
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'published';
  assignedTo: string;
  dueDate: Date;
  publishedAt?: Date;
  metrics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

// Report types
export interface Report {
  id: string;
  type: 'attendance' | 'tasks' | 'performance' | 'marketing';
  title: string;
  data: Record<string, unknown>;
  generatedAt: Date;
  period: 'daily' | 'weekly' | 'monthly';
}

// Navigation types
export type TabType =
  | 'dashboard'
  | 'employees'
  | 'shifts'
  | 'tasks'
  | 'attendance'
  | 'penalties'
  | 'reports'
  | 'settings'
  | 'profile';

// Theme types
export type Theme = 'light' | 'dark';

// Modal types
export type ModalType =
  | 'login'
  | 'task'
  | 'employee'
  | 'shift'
  | 'penalty'
  | 'report'
  | 'settings'
  | null;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'select'
    | 'textarea'
    | 'date'
    | 'number';
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Document types (Kontur.Diadoc integratsiyasi)
export interface Document {
  id: string;
  name: string;
  type: 'task_attachment' | 'report' | 'profile';
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  mimeType?: string;
  taskId?: string;
  reportId?: string;
}

export interface NFCConfig {
  enabled: boolean;
  deviceId?: string;
}

// Calendar types (Kontur.Extern integratsiyasi)
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'task' | 'meeting' | 'deadline';
  startDate: Date;
  endDate?: Date;
  assignee?: string;
  reminder?: Date;
  description?: string;
  color?: string;
}

export interface Deadline {
  id: string;
  taskId?: string;
  title: string;
  dueDate: Date;
  status: 'upcoming' | 'overdue' | 'completed';
  reminderSent: boolean;
  assignee?: string;
}

// Meeting types (Kontur.Tolk integratsiyasi)
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
  videoConferenceLink?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  reminderSent: boolean;
  organizer: string;
  calendarEventId?: string;
}

export interface VideoConference {
  meetingId: string;
  link: string;
  provider: 'webrtc' | 'zoom' | 'meet';
  maxParticipants: number;
  recordingEnabled: boolean;
  status: 'not_started' | 'in_progress' | 'ended';
}

// Notification types (Kontur.Diadoc integratsiyasi)
export interface NotificationItem {
  id: string;
  type: 'task' | 'deadline' | 'meeting';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

// Analytics types (Advanced Analytics)
export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface PerformanceInsight {
  id: string;
  type: 'attendance' | 'tasks' | 'productivity' | 'marketing';
  title: string;
  description: string;
  value: number;
  change: number; // foiz o'zgarish
  trend: 'up' | 'down' | 'stable';
  priority: 'low' | 'medium' | 'high';
  recommendation?: string;
}

export interface PredictiveAnalytics {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number; // 0-100
  timeframe: 'daily' | 'weekly' | 'monthly';
  factors: string[];
}

export interface AnalyticsData {
  trends: TrendData[];
  insights: PerformanceInsight[];
  predictions: PredictiveAnalytics[];
  summary: {
    totalEmployees: number;
    averageAttendance: number;
    taskCompletionRate: number;
    productivityScore: number;
  };
}

// AI types
export interface SmartRecommendation {
  id: string;
  type: 'task' | 'schedule' | 'optimization' | 'alert';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  confidence: number; // 0-100
  reasoning?: string;
}

export interface AIContent {
  id: string;
  type: 'instagram_post' | 'video_script' | 'article' | 'email';
  title: string;
  content: string;
  generatedAt: Date;
  metadata?: Record<string, unknown>;
}

// Workflow types
export interface WorkflowTrigger {
  id: string;
  type: 'time' | 'event' | 'condition' | 'manual';
  config: Record<string, unknown>;
}

export interface WorkflowAction {
  id: string;
  type:
    | 'create_task'
    | 'send_notification'
    | 'update_status'
    | 'send_email'
    | 'webhook';
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Collaboration types
export interface Comment {
  id: string;
  entityType: 'task' | 'document' | 'meeting' | 'report';
  entityId: string;
  author: string;
  content: string;
  mentions?: string[]; // @mentioned users
  createdAt: Date;
  updatedAt?: Date;
  replies?: Comment[];
}

export interface Activity {
  id: string;
  type:
    | 'task_created'
    | 'task_completed'
    | 'comment_added'
    | 'document_uploaded'
    | 'meeting_scheduled'
    | 'status_changed';
  actor: string;
  target: string;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  channel: string;
  author: string;
  content: string;
  mentions?: string[];
  timestamp: Date;
  edited?: boolean;
}

// Gamification types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'attendance' | 'tasks' | 'productivity' | 'social' | 'special';
  unlockedAt?: Date;
}

export interface UserPoints {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  rank: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  target: number;
  current: number;
  reward: number;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

// Security types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface TwoFactorConfig {
  enabled: boolean;
  method: 'totp' | 'sms' | 'email';
  secret?: string;
  backupCodes?: string[];
}

// Integration types
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  enabled: boolean;
  createdAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'zapier' | 'slack' | 'teams' | 'google_calendar' | 'outlook' | 'custom';
  config: Record<string, unknown>;
  enabled: boolean;
  createdAt: Date;
}
