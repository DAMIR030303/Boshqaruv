import { login, getSession } from '../services/authService';
import type { LoginCredentials, UserProfile } from '../types';

export const validateCredentials = async (credentials: LoginCredentials): Promise<boolean> => {
  const result = await login(credentials);
  return result.success;
};

export const getUserProfile = (_username?: string): UserProfile => {
  const session = getSession();
  if (session.isValid && session.user) {
    return session.user;
  }
  
  // Fallback for backwards compatibility
  return {
    name: 'Guest User',
    role: 'Xodim' as const,
    avatar: '/api/placeholder/40/40',
    status: 'offline' as const
  };
};

export const getPageTitle = (tab: string): string => {
  const titles: Record<string, string> = {
    dashboard: 'Bosh sahifa',
    employees: 'Xodimlar',
    shifts: 'Smenalar', 
    tasks: 'Vazifalar',
    attendance: 'Davomat',
    penalties: 'Jarimalar',
    reports: 'Hisobotlar',
    settings: 'Sozlamalar',
    profile: 'Profil'
  };
  
  return titles[tab] || 'Boshqaruv';
};

export const isEmployeeRole = (role: UserProfile['role']): boolean => {
  return role === 'Xodim' || role === 'Marketing boshqaruvchisi';
};
