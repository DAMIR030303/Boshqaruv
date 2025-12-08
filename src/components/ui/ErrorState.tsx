import type { ReactNode } from 'react';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  FileQuestion,
  Home,
  RefreshCw,
  ServerCrash,
  WifiOff,
} from 'lucide-react';

import { Button } from './Button';

/**
 * ErrorState variant tiplari
 */
export type ErrorStateVariant =
  | 'network'
  | '404'
  | '500'
  | 'generic'
  | 'offline';

/**
 * ErrorState komponenti props
 */
export interface ErrorStateProps {
  /** Error state variant */
  variant?: ErrorStateVariant;
  /** Sarlavha */
  title?: string;
  /** Tavsif */
  description?: string;
  /** Retry button onClick handler */
  onRetry?: () => void;
  /** Home button onClick handler */
  onHome?: () => void;
  /** Custom icon */
  icon?: ReactNode;
  /** Qo'shimcha className */
  className?: string;
  /** Compact mode (kichikroq ko'rinish) */
  compact?: boolean;
  /** Error code (404, 500, va hokazo) */
  errorCode?: string | number;
}

/**
 * Variant bo'yicha default icon'lar
 */
const variantIcons: Record<ErrorStateVariant, ReactNode> = {
  network: <WifiOff className="w-16 h-16" />,
  '404': <FileQuestion className="w-16 h-16" />,
  '500': <ServerCrash className="w-16 h-16" />,
  generic: <AlertCircle className="w-16 h-16" />,
  offline: <WifiOff className="w-16 h-16" />,
};

/**
 * Variant bo'yicha default title'lar
 */
const variantTitles: Record<ErrorStateVariant, string> = {
  network: "Internet aloqasi yo'q",
  '404': 'Sahifa topilmadi',
  '500': 'Server xatosi',
  generic: 'Xatolik yuz berdi',
  offline: 'Offline rejim',
};

/**
 * Variant bo'yicha default description'lar
 */
const variantDescriptions: Record<ErrorStateVariant, string> = {
  network: "Internet aloqasini tekshiring va qayta urinib ko'ring.",
  '404': "Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.",
  '500': "Serverda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
  generic: "Nimadir noto'g'ri ketdi. Iltimos, qayta urinib ko'ring.",
  offline: "Internet aloqasi yo'q. Iltimos, internet aloqasini yoqing.",
};

/**
 * Variant bo'yicha icon ranglari
 */
const variantIconColors: Record<ErrorStateVariant, string> = {
  network: 'text-yellow-500 dark:text-yellow-400',
  '404': 'text-blue-500 dark:text-blue-400',
  '500': 'text-red-500 dark:text-red-400',
  generic: 'text-red-500 dark:text-red-400',
  offline: 'text-gray-500 dark:text-gray-400',
};

/**
 * ErrorState - Xatolik holatida ko'rsatiladigan komponent
 *
 * Bu komponent turli xil xatolik holatlarida foydalanuvchiga
 * professional va tushunarli error state ko'rsatadi.
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorState
 *     variant="network"
 *     onRetry={() => refetch()}
 *   />
 * )}
 * ```
 */
export function ErrorState({
  variant = 'generic',
  title,
  description,
  onRetry,
  onHome,
  icon,
  className = '',
  compact = false,
  errorCode,
}: ErrorStateProps) {
  const displayIcon = icon || variantIcons[variant];
  const displayTitle = title || variantTitles[variant];
  const displayDescription = description || variantDescriptions[variant];
  const iconColor = variantIconColors[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {/* Error Code */}
      {errorCode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-4"
        >
          <span className="text-6xl font-bold text-slate-300 dark:text-slate-600">
            {errorCode}
          </span>
        </motion.div>
      )}

      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`mb-6 ${compact ? 'mb-4' : ''}`}
      >
        <div
          className={`w-24 h-24 ${compact ? 'w-16 h-16' : ''} rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center ${iconColor}`}
        >
          {displayIcon}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className={`text-xl ${compact ? 'text-lg' : ''} font-semibold text-slate-900 dark:text-white mb-2`}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className={`text-sm ${compact ? 'text-xs' : ''} text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 ${compact ? 'mb-4' : ''}`}
      >
        {displayDescription}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 items-center justify-center"
      >
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            size={compact ? 'sm' : 'md'}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Qayta urinish
          </Button>
        )}
        {onHome && (
          <Button
            onClick={onHome}
            variant="secondary"
            size={compact ? 'sm' : 'md'}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Bosh sahifaga qaytish
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
