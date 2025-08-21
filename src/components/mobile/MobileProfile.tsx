import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface MobileProfileProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

export function MobileProfile({ kpiData, userProfile, onDataUpdate, onProfileUpdate, onLogout }: MobileProfileProps) {
  return (
    <PlaceholderComponent
      title="Profil"
      description="Foydalanuvchi profili va ma'lumotlari"
    />
  );
}
