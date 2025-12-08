import { memo } from 'react';

import { Card } from './Card';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * SkeletonList komponenti props
 */
export interface SkeletonListProps {
  /** Nechta item ko'rsatish */
  count?: number;
  /** Avatar ko'rsatish */
  showAvatar?: boolean;
  /** Qo'shimcha className */
  className?: string;
}

/**
 * SkeletonList - List skeleton variant
 *
 * Bu komponent list ko'rinishidagi skeleton loader'ni ko'rsatadi.
 * Tasks, Employees va boshqa list-based sahifalar uchun ishlatiladi.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <SkeletonList count={5} showAvatar />
 * ) : (
 *   <List>Content</List>
 * )}
 * ```
 */
export const SkeletonList = memo(
  ({ count = 5, showAvatar = false, className = '' }: SkeletonListProps) => {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start space-x-4">
              {showAvatar && (
                <SkeletonLoader
                  width={48}
                  height={48}
                  variant="circle"
                  rounded="full"
                />
              )}
              <div className="flex-1 space-y-2">
                <SkeletonLoader width="70%" height={20} rounded="md" />
                <SkeletonLoader width="100%" height={16} rounded="md" />
                <SkeletonLoader width="60%" height={16} rounded="md" />
                <div className="flex space-x-2 pt-2">
                  <SkeletonLoader width={80} height={24} rounded="full" />
                  <SkeletonLoader width={100} height={24} rounded="full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
);

SkeletonList.displayName = 'SkeletonList';
