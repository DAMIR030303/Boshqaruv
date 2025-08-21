import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, children, elevated = false, padding = 'md', ...props }: CardProps) {
  const paddingClass = padding === 'none' ? 'p-0' : padding === 'sm' ? 'p-3' : padding === 'md' ? 'p-4' : 'p-6';
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl',
        elevated && 'shadow-sm',
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


