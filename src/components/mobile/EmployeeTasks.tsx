import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeTasksProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (data: any) => void;
}

export function EmployeeTasks({ kpiData, userProfile, onDataUpdate }: EmployeeTasksProps) {
  return (
    <PlaceholderComponent
      title="Mening vazifalarim"
      description="Shaxsiy vazifalar va bajarish holati"
    />
  );
}
