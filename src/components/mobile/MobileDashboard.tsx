// import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../ui/StatCard';
import { SectionTitle } from '../ui/SectionTitle';
import { QuickAction } from '../ui/QuickAction';
import { Users, CheckSquare, Calendar, TrendingUp, Plus } from 'lucide-react';
import type { KPIData, UserProfile } from '../../types';

interface MobileDashboardProps {
  kpiData: KPIData;
  userProfile: UserProfile;
  onDataUpdate: (_data: unknown) => void;
  onNavigate: (tab: string) => void;
}

export function MobileDashboard({ kpiData, userProfile, onDataUpdate: _onDataUpdate, onNavigate }: MobileDashboardProps) {
  const kpiCards: Array<{ title: string; value: string; subtitle: string; icon: any; color: string; onClick: () => void }> = [
    {
      title: 'Davomat',
      value: `${kpiData.attendance.present}/${kpiData.attendance.total}`,
      subtitle: `${kpiData.attendance.late} kechikkan`,
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => onNavigate('attendance')
    },
    {
      title: 'Vazifalar',
      value: `${kpiData.tasks.completed}/${kpiData.tasks.total}`,
      subtitle: `${kpiData.tasks.pending} kutilayotgan`,
      icon: CheckSquare,
      color: 'bg-green-500',
      onClick: () => onNavigate('tasks')
    },
    {
      title: 'Jarimalar',
      value: String(kpiData.penalties.active),
      subtitle: `${kpiData.penalties.resolved} hal qilingan`,
      icon: Calendar,
      color: 'bg-yellow-500',
      onClick: () => onNavigate('penalties')
    }
  ];

  const quickActions = [
    { label: 'Yangi vazifa', icon: Plus, action: () => onNavigate('tasks') },
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
          Bugungi ishlarni ko'rib chiqing va boshqaring
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {kpiCards.map((card, index) => (
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          So'nggi faollik
        </h2>
        <div className="space-y-3">
          {[
            { text: 'Yangi vazifa yaratildi', time: '5 daqiqa oldin', type: 'task' },
            { text: 'Davomat ma\'lumotlari yangilandi', time: '15 daqiqa oldin', type: 'attendance' },
            { text: 'Hisobot tayyorlandi', time: '1 soat oldin', type: 'report' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {activity.text}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
