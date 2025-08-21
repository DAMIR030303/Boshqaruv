import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileEmployeesProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function MobileEmployees({ kpiData, userProfile, onDataUpdate }: MobileEmployeesProps) {
  return (
    <PlaceholderComponent
      title="Xodimlar boshqaruvi"
      description="Xodimlar ro'yxati, ma'lumotlari va boshqaruvi"
    />
  );
}
