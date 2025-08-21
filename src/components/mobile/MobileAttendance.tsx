import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileAttendanceProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function MobileAttendance({ kpiData, userProfile, onDataUpdate }: MobileAttendanceProps) {
  return (
    <PlaceholderComponent
      title="Davomat boshqaruvi"
      description="Xodimlar davomati va monitoring"
    />
  );
}
