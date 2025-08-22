import React from 'react';
import { Card } from './Card';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass?: string;
  onClick?: () => void;
  containerClass?: string;
  progressCurrent?: number;
  progressTotal?: number;
  progressColorClass?: string; // bar color
  trackColorClass?: string;    // track color
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = 'bg-primary-500',
  onClick,
  containerClass,
  progressCurrent,
  progressTotal,
  progressColorClass = 'bg-blue-600',
  trackColorClass = 'bg-gray-200 dark:bg-gray-700'
}: StatCardProps) {
  const showProgress = typeof progressCurrent === 'number' && typeof progressTotal === 'number' && progressTotal > 0;
  const percent = showProgress ? Math.min(100, Math.max(0, Math.round((progressCurrent! / progressTotal!) * 100))) : 0;
  return (
    <Card className={clsx('cursor-pointer hover:shadow-md transition-shadow duration-200', containerClass)} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
          {showProgress && (
            <div className="mt-3">
              <div className={clsx('w-full h-2 rounded-full', trackColorClass)}>
                <div className={clsx('h-2 rounded-full transition-all', progressColorClass)} style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{percent}%</div>
            </div>
          )}
        </div>
        <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center', colorClass)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}


