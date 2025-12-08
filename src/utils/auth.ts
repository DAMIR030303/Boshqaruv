import { getSession } from '../services/authService';
import type { LoginCredentials, UserProfile } from '../types';

/**
 * Foydalanuvchi hisob ma'lumotlarini tekshirish
 *
 * @deprecated Bu funksiya useAuth hook orqali to'g'ridan-to'g'ri login() chaqirilishi kerak
 * @param credentials - Login ma'lumotlari (username va password)
 * @returns true agar ma'lumotlar to'g'ri bo'lsa
 */
export const validateCredentials = async (
  credentials: LoginCredentials
): Promise<boolean> => {
  const { login } = await import('../services/authService');
  const result = await login(credentials);
  return result.success;
};

/**
 * Joriy foydalanuvchi profilini olish
 *
 * Bu funksiya session'dan foydalanuvchi profilini olishga harakat qiladi.
 * Agar session yo'q bo'lsa, default guest profil qaytaradi.
 *
 * @param _username - Foydalanuvchi nomi (ixtiyoriy, hozircha ishlatilmaydi)
 * @returns Foydalanuvchi profil ma'lumotlari
 */
export const getUserProfile = async (
  _username?: string
): Promise<UserProfile> => {
  const session = await getSession();
  if (session.isValid && session.user) {
    return session.user;
  }

  // Default guest profil - session yo'q bo'lganda
  // Bu holat faqat development yoki xatolik holatlarida yuzaga keladi
  return {
    name: 'Guest User',
    role: 'Xodim' as const,
    avatar: '/api/placeholder/40/40',
    status: 'offline' as const,
  };
};

/**
 * Foydalanuvchi roli xodim yoki marketing boshqaruvchisi ekanligini tekshiradi
 *
 * @param role - Foydalanuvchi roli
 * @returns true agar rol xodim yoki marketing boshqaruvchisi bo'lsa
 */
export const isEmployeeRole = (role: UserProfile['role']): boolean => {
  return role === 'Xodim' || role === 'Marketing boshqaruvchisi';
};
