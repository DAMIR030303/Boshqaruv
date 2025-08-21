import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeReportsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function EmployeeReports({ kpiData, userProfile, onDataUpdate }: EmployeeReportsProps) {
  return (
    <PlaceholderComponent
      title="Mening hisobotlarim"
      description="Shaxsiy ishlash hisobotlari va statistikasi"
    />
  );
}
