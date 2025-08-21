import React from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const map: Record<Variant, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    muted: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[variant])}>
      {children}
    </span>
  );
}


