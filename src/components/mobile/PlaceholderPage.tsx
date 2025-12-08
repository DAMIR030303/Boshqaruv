import type { KPIData, UserProfile } from '../../types';

import { PlaceholderComponent } from './PlaceholderComponent';

/**
 * PlaceholderPage komponenti props
 */
interface PlaceholderPageProps {
  /** KPI ma'lumotlari (ixtiyoriy, hozircha ishlatilmaydi) */
  kpiData: KPIData;
  /** Foydalanuvchi profil ma'lumotlari (ixtiyoriy, hozircha ishlatilmaydi) */
  userProfile: UserProfile;
  /** Ma'lumotlar yangilanish handler (ixtiyoriy, hozircha ishlatilmaydi) */
  onDataUpdate: (_data: unknown) => void;
  /** Sahifa sarlavhasi */
  title: string;
  /** Sahifa tavsifi */
  description?: string;
}

/**
 * PlaceholderPage - Umumiy placeholder sahifa komponenti
 *
 * Bu komponent barcha placeholder sahifalar uchun umumiy wrapper
 * bo'lib, takrorlanishni kamaytiradi va kodni tushunishga oson qiladi.
 *
 * @param props - PlaceholderPageProps
 * @returns JSX element
 */
export function PlaceholderPage({
  title,
  description = 'Bu sahifa hali ishlab chiqilmoqda',
}: PlaceholderPageProps) {
  return <PlaceholderComponent title={title} description={description} />;
}
