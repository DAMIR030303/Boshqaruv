import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileSettingsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function MobileSettings({ kpiData, userProfile, onDataUpdate, isDark, onThemeToggle }: MobileSettingsProps) {
  return (
    <PlaceholderComponent
      title="Sozlamalar"
      description="Ilova sozlamalari va parametrlari"
    />
  );
}
