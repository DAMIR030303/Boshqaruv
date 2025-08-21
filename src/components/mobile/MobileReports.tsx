import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileReportsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function MobileReports({ kpiData, userProfile, onDataUpdate }: MobileReportsProps) {
  return (
    <PlaceholderComponent
      title="Hisobotlar"
      description="Turli xil hisobotlar va tahlillar"
    />
  );
}
