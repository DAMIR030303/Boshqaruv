import { useState } from 'react';

import { Calendar, CheckSquare, Plus, TrendingUp, Users } from 'lucide-react';

import { ANIMATION } from '../../constants/app';
import { getTranslation } from '../../i18n';
import type { KPIData, Task, UserProfile } from '../../types';
import { AnimatedSection } from '../ui/AnimatedSection';

import { ActivityFeed } from './ActivityFeed';
import { TaskForm } from './forms/TaskForm';
import {
  type DashboardCard,
  DashboardLayout,
  type QuickActionItem,
} from './shared/DashboardLayout';

/**
 * Mobile Dashboard komponenti props
 */
interface MobileDashboardProps {
  /** KPI ma'lumotlari */
  kpiData: KPIData;
  /** Foydalanuvchi profil ma'lumotlari */
  userProfile: UserProfile;
  /** Ma'lumotlar yangilanish handler (hozircha ishlatilmaydi) */
  onDataUpdate: (_data: unknown) => void;
  /** Navigatsiya handler */
  onNavigate: (tab: string) => void;
}

/**
 * Mobile Dashboard - Administrator va Manager uchun dashboard sahifasi
 *
 * Bu komponent admin va manager foydalanuvchilari uchun
 * asosiy dashboard sahifasini ko'rsatadi.
 *
 * @param props - MobileDashboardProps
 * @returns JSX element
 */
export function MobileDashboard({
  kpiData,
  userProfile,
  onDataUpdate: _onDataUpdate,
  onNavigate,
}: MobileDashboardProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);

  // i18n helper
  const t = (key: string) => getTranslation(key, 'uz');

  // KPI data validation - agar struktura to'liq bo'lmasa, default qiymatlar ishlatiladi
  const safeKpiData = {
    attendance: kpiData?.attendance || {
      present: 0,
      late: 0,
      absent: 0,
      total: 0,
    },
    tasks: kpiData?.tasks || {
      completed: 0,
      inProgress: 0,
      pending: 0,
      total: 0,
    },
    penalties: kpiData?.penalties || { active: 0, resolved: 0, total: 0 },
  };

  const handleTaskSubmit = (task: Task) => {
    setShowTaskModal(false);
    _onDataUpdate({ type: 'task_created', id: task.id });
    // Optionally navigate to tasks page
    // onNavigate('tasks');
  };

  const kpiCards: DashboardCard[] = [
    {
      title: t('dashboard.kpi.attendance'),
      value: `${safeKpiData.attendance.present}/${safeKpiData.attendance.total}`,
      subtitle: `${safeKpiData.attendance.late} ${t('dashboard.kpi.late')}`,
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      onClick: () => onNavigate('attendance'),
    },
    {
      title: t('dashboard.kpi.tasks'),
      value: `${safeKpiData.tasks.completed}/${safeKpiData.tasks.total}`,
      subtitle: `${safeKpiData.tasks.pending} ${t('dashboard.kpi.pending')}`,
      icon: CheckSquare,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      onClick: () => onNavigate('tasks'),
    },
    {
      title: t('dashboard.kpi.penalties'),
      value: String(safeKpiData.penalties.active),
      subtitle: `${safeKpiData.penalties.resolved} ${t('dashboard.kpi.resolved')}`,
      icon: Calendar,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      onClick: () => onNavigate('penalties'),
    },
  ];

  const quickActions: QuickActionItem[] = [
    {
      label: t('common.newTask') || 'Yangi vazifa',
      icon: Plus,
      action: () => setShowTaskModal(true),
    },
    {
      label: t('dashboard.quickActions.attendance'),
      icon: Calendar,
      action: () => onNavigate('attendance'),
    },
    {
      label: t('dashboard.quickActions.reports'),
      icon: TrendingUp,
      action: () => onNavigate('reports'),
    },
  ];

  return (
    <div className="app-main w-full min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="app-container py-6">
        {/* Debug info - only in development */}
        {(import.meta.env.DEV || import.meta.env.MODE === 'development') && (
          <div className="mb-4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
            <p className="font-bold mb-1">Debug Info:</p>
            <p>User: {userProfile?.name || 'N/A'}</p>
            <p>Role: {userProfile?.role || 'N/A'}</p>
          </div>
        )}

        <DashboardLayout
          userProfile={userProfile}
          welcomeMessage={t('dashboard.welcomeAdmin')}
          kpiCards={kpiCards}
          quickActions={quickActions}
        >
          {/* Recent Activity */}
          <AnimatedSection delay={ANIMATION.DELAY_XXLARGE}>
            <ActivityFeed limit={5} realTime={true} />
          </AnimatedSection>

          {/* Quick Task Modal */}
          <TaskForm
            onSubmit={handleTaskSubmit}
            onClose={() => setShowTaskModal(false)}
            isOpen={showTaskModal}
          />
        </DashboardLayout>
      </div>
    </div>
  );
}
