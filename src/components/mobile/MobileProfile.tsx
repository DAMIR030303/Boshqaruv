// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileProfileProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

export function MobileProfile({ onProfileUpdate: _onProfileUpdate, onLogout: _onLogout }: MobileProfileProps) {
  return (
    <PlaceholderComponent
      title="Profil"
      description="Foydalanuvchi profili va ma'lumotlari"
    />
  );
}
