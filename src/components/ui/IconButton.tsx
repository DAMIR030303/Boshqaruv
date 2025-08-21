import React from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'primary' | 'danger';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
}

export function IconButton({ className, children, variant = 'default', size = 'md', ...props }: IconButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<Variant, string> = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white',
  };
  const sizes = {
    sm: 'p-2',
    md: 'p-2.5',
  } as const;

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}


