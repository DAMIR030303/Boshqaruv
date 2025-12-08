import { Calendar, CheckSquare, Clock, Target, TrendingUp } from 'lucide-react';

import { ANIMATION } from '../../constants/app';
import { getTranslation } from '../../i18n';
import type { KPIData, UserProfile } from '../../types';
import { AnimatedSection } from '../ui/AnimatedSection';
import { SectionTitle } from '../ui/SectionTitle';
import { TaskItem } from '../ui/TaskItem';

import {
  type DashboardCard,
  DashboardLayout,
  type QuickActionItem,
} from './shared/DashboardLayout';

/**
 * Employee Dashboard komponenti props
 */
interface EmployeeDashboardProps {
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
 * Employee Dashboard - Xodim va Marketing boshqaruvchisi uchun dashboard sahifasi
 *
 * Bu komponent oddiy xodim va marketing boshqaruvchisi uchun
 * asosiy dashboard sahifasini ko'rsatadi.
 *
 * @param props - EmployeeDashboardProps
 * @returns JSX element
 */
export function EmployeeDashboard({
  kpiData,
  userProfile,
  onDataUpdate: _onDataUpdate,
  onNavigate,
}: EmployeeDashboardProps) {
  const isMarketing = userProfile.role === 'Marketing boshqaruvchisi';

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

  const employeeCards: DashboardCard[] = [
    {
      title: t('dashboard.employee.todayTasks'),
      value: `${safeKpiData.tasks.completed}/${safeKpiData.tasks.total}`,
      subtitle: `${safeKpiData.tasks.pending} ${t('dashboard.kpi.pending')}`,
      icon: CheckSquare,
      color: 'bg-green-500',
      onClick: () => onNavigate('tasks'),
    },
    {
      title: t('dashboard.employee.attendanceStatus'),
      value:
        safeKpiData.attendance.present > 0
          ? t('dashboard.kpi.present')
          : t('dashboard.kpi.absent'),
      subtitle: t('dashboard.employee.todayStatus'),
      icon: Calendar,
      color: 'bg-blue-500',
      onClick: () => onNavigate('attendance'),
    },
  ];

  const marketingCards: DashboardCard[] = [
    {
      title: t('dashboard.marketing.instagramPosts'),
      value: '15',
      subtitle: '/18',
      icon: Target,
      color: 'bg-instagram-600',
      bgClass: 'bg-instagram-50/80 dark:bg-instagram-900/10',
      progressCurrent: 15,
      progressTotal: 18,
      progressColorClass: 'bg-instagram-600',
      trackColorClass: 'bg-gray-200/80 dark:bg-gray-700',
    },
    {
      title: t('dashboard.marketing.videoEditing'),
      value: '10',
      subtitle: '/15',
      icon: TrendingUp,
      color: 'bg-video-600',
      bgClass: 'bg-video-50/80 dark:bg-video-900/10',
      progressCurrent: 10,
      progressTotal: 15,
      progressColorClass: 'bg-video-600',
      trackColorClass: 'bg-gray-200/80 dark:bg-gray-700',
    },
    {
      title: t('dashboard.marketing.contentMonitoring'),
      value: t('dashboard.marketing.active'),
      subtitle: t('dashboard.marketing.realtime'),
      icon: Clock,
      color: 'bg-content-600',
      bgClass: 'bg-content-50/80 dark:bg-content-900/10',
    },
  ];

  const quickActions: QuickActionItem[] = [
    {
      label: t('dashboard.quickActions.tasks'),
      icon: CheckSquare,
      action: () => onNavigate('tasks'),
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
    <DashboardLayout
      userProfile={userProfile}
      welcomeMessage={
        isMarketing
          ? t('dashboard.welcomeMarketing')
          : t('dashboard.welcomeEmployee')
      }
      kpiCards={isMarketing ? marketingCards : employeeCards}
      quickActions={quickActions}
    >
      {/* Today's Summary */}
      <AnimatedSection delay={ANIMATION.DELAY_XXLARGE}>
        <SectionTitle>{t('dashboard.todaySummary')}</SectionTitle>
        <div className="card">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.employee.arrivalTime')}
              </p>
              <p className="mt-1 text-lg font-semibold">08:30</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('dashboard.employee.tasks')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {safeKpiData.tasks.completed}/{safeKpiData.tasks.total}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Today's Tasks list matching sample */}
      <AnimatedSection
        delay={ANIMATION.DELAY_XLARGE + ANIMATION.DELAY_SMALL}
        className="mt-6"
      >
        <SectionTitle>{t('dashboard.todayTasks')}</SectionTitle>
        <div className="space-y-3">
          <TaskItem
            title="Oylik hisobot tayyorlash"
            priority="Yuqori"
            time="16:00"
          />
          <TaskItem
            title="Mijozlar bilan uchrashuv"
            priority="O'rta"
            time="14:30"
            done
          />
          <TaskItem
            title="Hujjatlarni tekshirish"
            priority="Past"
            time="18:00"
          />
        </div>
      </AnimatedSection>
    </DashboardLayout>
  );
}
