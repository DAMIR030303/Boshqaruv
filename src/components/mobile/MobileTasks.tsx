// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileTasksProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function MobileTasks(_: MobileTasksProps) {
  return (
    <PlaceholderComponent
      title="Vazifalar boshqaruvi"
      description="Vazifalar ro'yxati, yaratish va boshqaruvi"
    />
  );
}
