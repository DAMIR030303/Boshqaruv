// User and authentication types
export interface UserProfile {
  name: string;
  role: 'Administrator' | 'Manager' | 'Xodim' | 'Marketing boshqaruvchisi';
  avatar: string;
  status: 'online' | 'offline';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// KPI and data types
export interface KPIData {
  attendance: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
  tasks: {
    completed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  penalties: {
    active: number;
    resolved: number;
    total: number;
  };
}

// Task management types
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance types
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
export type TabType = 'dashboard' | 'employees' | 'shifts' | 'tasks' | 'attendance' | 'penalties' | 'reports' | 'settings' | 'profile';

// Theme types
export type Theme = 'light' | 'dark';

// Modal types
export type ModalType = 'login' | 'task' | 'employee' | 'shift' | 'penalty' | 'report' | 'settings' | null;

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
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'number';
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
