import { memo } from 'react';
import type { ComponentType, SVGProps } from 'react';

import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  colorClass?: string;
  onClick?: () => void;
  containerClass?: string;
  bgClass?: string;
  progressCurrent?: number;
  progressTotal?: number;
  progressColorClass?: string;
  trackColorClass?: string;
}

/**
 * Responsive Stat Card komponenti
 * Korporativ dizaynda statistika ko'rsatish uchun
 */
export const StatCard = memo(
  ({
    title,
    value,
    subtitle,
    icon: Icon,
    colorClass = 'bg-blue-600',
    onClick,
    containerClass,
    bgClass,
    progressCurrent,
    progressTotal,
    progressColorClass = 'bg-blue-600',
    trackColorClass = 'bg-slate-200 dark:bg-slate-700',
  }: StatCardProps) => {
    const showProgress =
      typeof progressCurrent === 'number' &&
      typeof progressTotal === 'number' &&
      progressTotal > 0;
    const percent = showProgress
      ? Math.min(
          100,
          Math.max(0, Math.round((progressCurrent! / progressTotal!) * 100))
        )
      : 0;

    return (
      <div
        className={clsx('stat-card card-hover', bgClass ?? containerClass)}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={e => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Icon */}
        <div className={clsx('stat-card-icon', colorClass)}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="stat-card-label">{title}</p>
          <p className="stat-card-value">{value}</p>

          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}

          {/* Progress bar */}
          {showProgress && (
            <div className="mt-3">
              <div className={clsx('w-full h-2 rounded-full', trackColorClass)}>
                <div
                  className={clsx(
                    'h-2 rounded-full transition-all duration-300',
                    progressColorClass
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {percent}% bajarildi
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
