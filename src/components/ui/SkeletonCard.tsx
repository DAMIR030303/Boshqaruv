import { memo } from 'react';

import { Card } from './Card';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * SkeletonCard komponenti props
 */
export interface SkeletonCardProps {
  /** Card'da nechta qator ko'rsatish */
  lines?: number;
  /** Avatar ko'rsatish */
  showAvatar?: boolean;
  /** Qo'shimcha className */
  className?: string;
}

/**
 * SkeletonCard - Card skeleton variant
 *
 * Bu komponent card ko'rinishidagi skeleton loader'ni ko'rsatadi.
 * Dashboard va boshqa card-based sahifalar uchun ishlatiladi.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <SkeletonCard lines={3} showAvatar />
 * ) : (
 *   <Card>Content</Card>
 * )}
 * ```
 */
export const SkeletonCard = memo(
  ({ lines = 3, showAvatar = false, className = '' }: SkeletonCardProps) => {
    return (
      <Card className={className}>
        <div className="flex items-start space-x-4">
          {showAvatar && (
            <SkeletonLoader
              width={48}
              height={48}
              variant="circle"
              rounded="full"
            />
          )}
          <div className="flex-1 space-y-3">
            <SkeletonLoader width="60%" height={20} rounded="md" />
            <SkeletonLoader width="100%" height={16} rounded="md" />
            {lines > 2 && (
              <SkeletonLoader width="80%" height={16} rounded="md" />
            )}
            {lines > 3 && (
              <SkeletonLoader width="90%" height={16} rounded="md" />
            )}
            {lines > 4 && (
              <div className="flex space-x-2 pt-2">
                <SkeletonLoader width={80} height={24} rounded="full" />
                <SkeletonLoader width={80} height={24} rounded="full" />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';
