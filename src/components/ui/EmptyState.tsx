import type { ReactNode } from 'react';

import { motion } from 'framer-motion';
import {
  Bell,
  CheckSquare,
  FileText,
  Inbox,
  Plus,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';

import { Button } from './Button';

/**
 * EmptyState variant tiplari
 */
export type EmptyStateVariant =
  | 'tasks'
  | 'employees'
  | 'reports'
  | 'notifications'
  | 'search'
  | 'default';

/**
 * EmptyState komponenti props
 */
export interface EmptyStateProps {
  /** Empty state variant */
  variant?: EmptyStateVariant;
  /** Sarlavha */
  title?: string;
  /** Tavsif */
  description?: string;
  /** Action button matni */
  actionLabel?: string;
  /** Action button onClick handler */
  onAction?: () => void;
  /** Custom icon */
  icon?: ReactNode;
  /** Qo'shimcha className */
  className?: string;
  /** Compact mode (kichikroq ko'rinish) */
  compact?: boolean;
}

/**
 * Variant bo'yicha default icon'lar
 */
const variantIcons: Record<EmptyStateVariant, ReactNode> = {
  tasks: <CheckSquare className="w-16 h-16" />,
  employees: <Users className="w-16 h-16" />,
  reports: <FileText className="w-16 h-16" />,
  notifications: <Bell className="w-16 h-16" />,
  search: <Search className="w-16 h-16" />,
  default: <Inbox className="w-16 h-16" />,
};

/**
 * Variant bo'yicha default title'lar
 */
const variantTitles: Record<EmptyStateVariant, string> = {
  tasks: "Vazifalar yo'q",
  employees: "Xodimlar yo'q",
  reports: "Hisobotlar yo'q",
  notifications: "Bildirishnomalar yo'q",
  search: 'Natijalar topilmadi',
  default: "Ma'lumot yo'q",
};

/**
 * Variant bo'yicha default description'lar
 */
const variantDescriptions: Record<EmptyStateVariant, string> = {
  tasks:
    'Hozircha vazifalar mavjud emas. Yangi vazifa yaratish uchun quyidagi tugmani bosing.',
  employees:
    "Hozircha xodimlar ro'yxatida hech kim yo'q. Yangi xodim qo'shish uchun quyidagi tugmani bosing.",
  reports:
    'Hozircha hisobotlar mavjud emas. Yangi hisobot yaratish uchun quyidagi tugmani bosing.',
  notifications:
    "Sizda yangi bildirishnomalar yo'q. Barcha yangilanishlar shu yerda ko'rsatiladi.",
  search:
    "Qidiruv natijalari topilmadi. Boshqa kalit so'zlar bilan qayta urinib ko'ring.",
  default: "Ma'lumotlar hozircha mavjud emas.",
};

/**
 * Variant bo'yicha default action label'lar
 */
const variantActionLabels: Record<EmptyStateVariant, string> = {
  tasks: 'Yangi vazifa yaratish',
  employees: "Yangi xodim qo'shish",
  reports: 'Yangi hisobot yaratish',
  notifications: 'Yangilash',
  search: 'Qayta qidirish',
  default: "Qo'shish",
};

/**
 * Variant bo'yicha icon ranglari
 */
const variantIconColors: Record<EmptyStateVariant, string> = {
  tasks: 'text-blue-500 dark:text-blue-400',
  employees: 'text-green-500 dark:text-green-400',
  reports: 'text-purple-500 dark:text-purple-400',
  notifications: 'text-yellow-500 dark:text-yellow-400',
  search: 'text-gray-500 dark:text-gray-400',
  default: 'text-slate-500 dark:text-slate-400',
};

/**
 * EmptyState - Ma'lumot yo'q bo'lganda ko'rsatiladigan komponent
 *
 * Bu komponent turli xil sahifalarda ma'lumot yo'q bo'lganda
 * foydalanuvchiga professional va tushunarli empty state ko'rsatadi.
 *
 * @example
 * ```tsx
 * {tasks.length === 0 && (
 *   <EmptyState
 *     variant="tasks"
 *     onAction={() => setShowAddModal(true)}
 *   />
 * )}
 * ```
 */
export function EmptyState({
  variant = 'default',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
  compact = false,
}: EmptyStateProps) {
  const displayIcon = icon || variantIcons[variant];
  const displayTitle = title || variantTitles[variant];
  const displayDescription = description || variantDescriptions[variant];
  const displayActionLabel = actionLabel || variantActionLabels[variant];
  const iconColor = variantIconColors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={`mb-6 ${compact ? 'mb-4' : ''}`}
      >
        <div
          className={`w-24 h-24 ${compact ? 'w-16 h-16' : ''} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${iconColor}`}
        >
          {displayIcon}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`text-xl ${compact ? 'text-lg' : ''} font-semibold text-slate-900 dark:text-white mb-2`}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className={`text-sm ${compact ? 'text-xs' : ''} text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 ${compact ? 'mb-4' : ''}`}
      >
        {displayDescription}
      </motion.p>

      {/* Action Button */}
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size={compact ? 'sm' : 'md'}
            leftIcon={
              variant === 'notifications' ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )
            }
          >
            {displayActionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
