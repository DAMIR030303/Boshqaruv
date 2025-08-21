// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileShiftsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileShifts(_: MobileShiftsProps) {
  return (
    <PlaceholderComponent
      title="Smenalar boshqaruvi"
      description="Smena jadvali va xodimlar smenasi"
    />
  );
}
