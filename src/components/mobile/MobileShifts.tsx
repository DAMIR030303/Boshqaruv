import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileShiftsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function MobileShifts({ kpiData, userProfile, onDataUpdate }: MobileShiftsProps) {
  return (
    <PlaceholderComponent
      title="Smenalar boshqaruvi"
      description="Smena jadvali va xodimlar smenasi"
    />
  );
}
