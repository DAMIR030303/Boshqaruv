// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileAttendanceProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileAttendance(_: MobileAttendanceProps) {
  return (
    <PlaceholderComponent
      title="Davomat boshqaruvi"
      description="Xodimlar davomati va monitoring"
    />
  );
}
