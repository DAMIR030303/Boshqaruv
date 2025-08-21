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
        'bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/70 dark:border-gray-700/60 rounded-2xl shadow-md transition-all duration-200',
        elevated && 'shadow-lg',
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


