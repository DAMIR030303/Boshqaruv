import type { KPIData, UserProfile } from '../../types';

import { PlaceholderPage } from './PlaceholderPage';

/**
 * EmployeeTasks komponenti props
 */
interface EmployeeTasksProps {
  /** KPI ma'lumotlari */
  kpiData: KPIData;
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile: UserProfile;
  /** Ma'lumotlar yangilanish handler */
  onDataUpdate: (_data: unknown) => void;
}

/**
 * EmployeeTasks - Xodim va Marketing boshqaruvchisi uchun vazifalar sahifasi
 *
 * Bu komponent hozircha placeholder sifatida ishlaydi.
 * Keyinchalik to'liq funksional shaxsiy vazifalar boshqaruvi qo'shiladi.
 *
 * @param props - EmployeeTasksProps
 * @returns JSX element
 */
export function EmployeeTasks(props: EmployeeTasksProps) {
  return (
    <PlaceholderPage
      {...props}
      title="Mening vazifalarim"
      description="Shaxsiy vazifalar va bajarish holati"
    />
  );
}
