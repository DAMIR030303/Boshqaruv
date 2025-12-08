import React from 'react';

import { clsx } from 'clsx';

export type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo o'lchami */
  size?: LogoSize;
  /** Qo'shimcha className */
  className?: string;
  /** Variant: default yoki simple */
  variant?: 'default' | 'simple';
}

const sizeClasses: Record<LogoSize, string> = {
  sm: 'w-9 h-9',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses: Record<LogoSize, string> = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

/**
 * Logo komponenti
 * Boshqaruv tizimi logosi uchun qayta ishlatiluvchan komponent
 */
export function Logo({
  size = 'md',
  variant = 'default',
  className,
  ...props
}: LogoProps) {
  const isDefault = variant === 'default';

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'rounded-lg',
        size === 'md' && 'rounded-xl',
        size === 'lg' && 'rounded-2xl',
        isDefault
          ? 'bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105'
          : 'bg-blue-600 shadow-sm',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <svg
        className={clsx('text-white', iconSizeClasses[size])}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
  );
}
