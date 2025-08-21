import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileTasksProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function MobileTasks({ kpiData, userProfile, onDataUpdate }: MobileTasksProps) {
  return (
    <PlaceholderComponent
      title="Vazifalar boshqaruvi"
      description="Vazifalar ro'yxati, yaratish va boshqaruvi"
    />
  );
}
