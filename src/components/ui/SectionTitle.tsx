import React from 'react';

import { clsx } from 'clsx';

interface SectionTitleProps {
  children: React.ReactNode;
  /** Kichik subtitle */
  subtitle?: string;
  /** Qo'shimcha action */
  action?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Section Title komponenti
 * Bo'lim sarlavhasi uchun
 */
export function SectionTitle({
  children,
  subtitle,
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between mb-4 sm:mb-5',
        className
      )}
    >
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
          {children}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
