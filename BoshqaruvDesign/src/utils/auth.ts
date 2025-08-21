import { VALID_CREDENTIALS, USER_PROFILES } from '../constants/app';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  status: string;
}

export const validateCredentials = async (credentials: LoginCredentials): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return VALID_CREDENTIALS.some(
    cred => cred.username === credentials.username && cred.password === credentials.password
  );
};

export const getUserProfile = (username: string): UserProfile => {
  return USER_PROFILES[username as keyof typeof USER_PROFILES] || USER_PROFILES.admin;
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

export const isEmployeeRole = (role: string): boolean => {
  return role === 'Marketolog' || role === 'Xodim' || role === 'Marketing boshqaruvchisi';
};