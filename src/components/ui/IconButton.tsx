import React from 'react';

import { clsx } from 'clsx';

type Variant = 'default' | 'primary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button varianti */
  variant?: Variant;
  /** Button o'lchami */
  size?: Size;
}

/**
 * Icon Button komponenti
 * Faqat icon ko'rsatadigan tugma
 */
export function IconButton({
  className,
  children,
  variant = 'default',
  size = 'md',
  ...props
}: IconButtonProps) {
  const variantClasses: Record<Variant, string> = {
    default:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800',
  };

  const sizeClasses: Record<Size, string> = {
    sm: 'p-1.5 rounded-md',
    md: 'p-2.5 rounded-lg',
    lg: 'p-3 rounded-xl',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
