import React from 'react';

import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevated - kuchliroq shadow */
  elevated?: boolean;
  /** Padding o'lchami */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover effekti */
  hoverable?: boolean;
}

/**
 * Responsive Card komponenti
 * Korporativ dizaynda kontent o'rash uchun
 */
export function Card({
  className,
  children,
  elevated = false,
  padding = 'md',
  hoverable = false,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 lg:p-6',
    lg: 'p-5 sm:p-6 lg:p-8',
  };

  return (
    <div
      className={clsx(
        'card',
        elevated && 'card-elevated',
        hoverable && 'card-hover',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header komponenti
 */
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('card-header', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Title komponenti
 */
export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx('card-title', className)} {...props}>
      {children}
    </h3>
  );
}

/**
 * Card Subtitle komponenti
 */
export function CardSubtitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx('card-subtitle', className)} {...props}>
      {children}
    </p>
  );
}
