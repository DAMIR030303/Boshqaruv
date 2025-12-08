import type { KPIData, UserProfile } from '../../types';

import { PlaceholderComponent } from './PlaceholderComponent';

interface EmployeeReportsProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
}

export function EmployeeReports(_: EmployeeReportsProps) {
  return (
    <PlaceholderComponent
      title="Mening hisobotlarim"
      description="Shaxsiy ishlash hisobotlari va statistikasi"
    />
  );
}
