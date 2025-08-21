// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileSettingsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function MobileSettings({ isDark: _isDark, onThemeToggle: _onThemeToggle }: MobileSettingsProps) {
  return (
    <PlaceholderComponent
      title="Sozlamalar"
      description="Ilova sozlamalari va parametrlari"
    />
  );
}
