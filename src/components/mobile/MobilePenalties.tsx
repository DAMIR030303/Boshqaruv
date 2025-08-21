import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobilePenaltiesProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function MobilePenalties({ kpiData, userProfile, onDataUpdate }: MobilePenaltiesProps) {
  return (
    <PlaceholderComponent
      title="Jarimalar boshqaruvi"
      description="Jarimalar ro'yxati va boshqaruvi"
    />
  );
}
