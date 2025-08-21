// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeReportsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function EmployeeReports(_: EmployeeReportsProps) {
  return (
    <PlaceholderComponent
      title="Mening hisobotlarim"
      description="Shaxsiy ishlash hisobotlari va statistikasi"
    />
  );
}
