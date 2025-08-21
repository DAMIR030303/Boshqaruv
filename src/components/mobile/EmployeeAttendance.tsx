// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeAttendanceProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function EmployeeAttendance(_: EmployeeAttendanceProps) {
  return (
    <PlaceholderComponent
      title="Mening davomatim"
      description="Shaxsiy davomat ma'lumotlari va kelish-ketish"
    />
  );
}
