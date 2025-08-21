// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobilePenaltiesProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobilePenalties(_: MobilePenaltiesProps) {
  return (
    <PlaceholderComponent
      title="Jarimalar boshqaruvi"
      description="Jarimalar ro'yxati va boshqaruvi"
    />
  );
}
