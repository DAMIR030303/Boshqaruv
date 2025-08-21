// import React from 'react';
import { PlaceholderComponent } from './PlaceholderComponent';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeTasksProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function EmployeeTasks(_: EmployeeTasksProps) {
  return (
    <PlaceholderComponent
      title="Mening vazifalarim"
      description="Shaxsiy vazifalar va bajarish holati"
    />
  );
}
