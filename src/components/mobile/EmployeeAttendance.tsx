import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeAttendanceProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function EmployeeAttendance({ kpiData, userProfile, onDataUpdate }: EmployeeAttendanceProps) {
  return (
    <PlaceholderComponent
      title="Mening davomatim"
      description="Shaxsiy davomat ma'lumotlari va kelish-ketish"
    />
  );
}
