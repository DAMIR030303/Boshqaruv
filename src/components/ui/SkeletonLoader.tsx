import { memo } from 'react';

import { clsx } from 'clsx';

/**
 * SkeletonLoader komponenti props
 */
export interface SkeletonLoaderProps {
  /** Skeleton o'lchami */
  width?: string | number;
  /** Skeleton balandligi */
  height?: string | number;
  /** Shimmer effect (default: true) */
  shimmer?: boolean;
  /** Qo'shimcha className */
  className?: string;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Variant (line, circle, rectangle) */
  variant?: 'line' | 'circle' | 'rectangle';
}

/**
 * SkeletonLoader - Yuklanish vaqtida ko'rsatiladigan skeleton komponenti
 *
 * Bu komponent ma'lumotlar yuklanayotganda professional skeleton screen
 * ko'rsatadi. Shimmer effect bilan animatsiya qo'shiladi.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <SkeletonLoader width="100%" height="200px" rounded="lg" />
 * ) : (
 *   <Content />
 * )}
 * ```
 */
export const SkeletonLoader = memo(
  ({
    width = '100%',
    height = '20px',
    shimmer = true,
    className = '',
    rounded = 'md',
    variant = 'line',
  }: SkeletonLoaderProps) => {
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    const variantClasses = {
      line: '',
      circle: 'rounded-full',
      rectangle: '',
    };

    const style: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
      <div
        className={clsx(
          'skeleton-loader',
          roundedClasses[rounded],
          variantClasses[variant],
          shimmer && 'skeleton-shimmer',
          className
        )}
        style={style}
        aria-label="Yuklanmoqda..."
        aria-busy="true"
      />
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';
