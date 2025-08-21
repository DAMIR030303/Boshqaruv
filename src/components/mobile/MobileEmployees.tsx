// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileEmployeesProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileEmployees(_: MobileEmployeesProps) {
  return (
    <PlaceholderComponent
      title="Xodimlar boshqaruvi"
      description="Xodimlar ro'yxati, ma'lumotlari va boshqaruvi"
    />
  );
}
