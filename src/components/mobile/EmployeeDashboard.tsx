// import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../ui/StatCard';
import { SectionTitle } from '../ui/SectionTitle';
import { QuickAction } from '../ui/QuickAction';
import { TaskItem } from '../ui/TaskItem';
import { CheckSquare, Calendar, TrendingUp, Clock, Target } from 'lucide-react';
import type { KPIData, UserProfile } from '../../types';

interface EmployeeDashboardProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  onNavigate: (tab: string) => void;
}

export function EmployeeDashboard({ kpiData, userProfile, onDataUpdate: _onDataUpdate, onNavigate }: EmployeeDashboardProps) {
  const isMarketing = userProfile.role === 'Marketing boshqaruvchisi';
  
  interface DashboardCardBase { title: string; value: string; subtitle: string; icon: any; color: string; onClick?: () => void }
  const employeeCards: DashboardCardBase[] = [
    {
      title: 'Bugungi vazifalar',
      value: `${kpiData.tasks.completed}/${kpiData.tasks.total}`,
      subtitle: `${kpiData.tasks.pending} kutilayotgan`,
      icon: CheckSquare,
      color: 'bg-green-500',
      onClick: () => onNavigate('tasks')
    },
    {
      title: 'Davomat holati',
      value: kpiData.attendance.present > 0 ? 'Kelgan' : 'Kelmagan',
      subtitle: 'Bugungi holat',
      icon: Calendar,
      color: 'bg-blue-500',
      onClick: () => onNavigate('attendance')
    }
  ];

  const marketingCards: DashboardCardBase[] = [
    {
      title: 'Instagram postlar',
      value: '15',
      subtitle: '/18',
      icon: Target,
      color: 'bg-pink-500'
    },
    {
      title: 'Video montaj',
      value: '10',
      subtitle: '/15',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Kontent monitoring',
      value: 'Aktiv',
      subtitle: 'Real vaqtda',
      icon: Clock,
      color: 'bg-green-500'
    }
  ];

  const quickActions = [
    { label: 'Vazifalar', icon: CheckSquare, action: () => onNavigate('tasks') },
    { label: 'Davomat', icon: Calendar, action: () => onNavigate('attendance') },
    { label: 'Hisobot', icon: TrendingUp, action: () => onNavigate('reports') }
  ];

  return (
    <div className="mobile-content">
      {/* Welcome Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Xush kelibsiz, {userProfile.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isMarketing ? 'Marketing vazifalarini boshqaring' : 'Bugungi ishlarni ko\'rib chiqing'}
        </p>
      </motion.div>

      {/* Role-specific Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {(isMarketing ? marketingCards : employeeCards).map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              colorClass={card.color}
              containerClass={card.title.includes('Instagram') ? 'bg-pink-50/80 dark:bg-fuchsia-900/20' : card.title.includes('Video') ? 'bg-blue-50/80 dark:bg-blue-900/20' : 'bg-green-50/80 dark:bg-emerald-900/20'}
              progressCurrent={card.title.includes('Instagram') ? 15 : card.title.includes('Video') ? 10 : undefined as any}
              progressTotal={card.title.includes('Instagram') ? 18 : card.title.includes('Video') ? 15 : undefined as any}
              progressColorClass={card.title.includes('Instagram') ? 'bg-blue-700' : 'bg-blue-600'}
              trackColorClass={'bg-blue-100 dark:bg-gray-700'}
              onClick={card.onClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionTitle>Tezkor amallar</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            >
              <QuickAction title={action.label} icon={action.icon} onClick={action.action} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <SectionTitle>Bugungi xulosa</SectionTitle>
        <div className="card">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kelish vaqti</p>
              <p className="mt-1 text-lg font-semibold">08:30</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vazifalar</p>
              <p className="mt-1 text-lg font-semibold">{kpiData.tasks.completed}/{kpiData.tasks.total}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Tasks list matching sample */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6"
      >
        <SectionTitle>Bugungi vazifalar</SectionTitle>
        <div className="space-y-3">
          <TaskItem title="Oylik hisobot tayyorlash" priority="Yuqori" time="16:00" />
          <TaskItem title="Mijozlar bilan uchrashuv" priority="O'rta" time="14:30" done />
          <TaskItem title="Hujjatlarni tekshirish" priority="Past" time="18:00" />
        </div>
      </motion.div>
    </div>
  );
}
