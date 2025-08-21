// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileReportsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileReports(_: MobileReportsProps) {
  return (
    <PlaceholderComponent
      title="Hisobotlar"
      description="Turli xil hisobotlar va tahlillar"
    />
  );
}
