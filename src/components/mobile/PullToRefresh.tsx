import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

/**
 * Pull-to-Refresh komponenti
 *
 * Mobile qurilmalarda yuqoridan tortib yangilash funksiyasini ta'minlaydi
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const isPulling = useRef(false);

  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        const pullAmount = Math.min(distance, threshold * 1.5);
        setPullDistance(pullAmount);
        y.set(pullAmount);
      } else {
        isPulling.current = false;
        setPullDistance(0);
        y.set(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;

      isPulling.current = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        y.set(threshold);

        try {
          await onRefresh();
        } catch (error) {
          console.error('Pull to refresh error:', error);
        } finally {
          setIsRefreshing(false);
          y.set(0);
          setPullDistance(0);
        }
      } else {
        y.set(0);
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isRefreshing, pullDistance, threshold, y, onRefresh]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const shouldShowIndicator = pullDistance > 0 || isRefreshing;

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      {shouldShowIndicator && (
        <motion.div
          style={{ y: springY }}
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-2">
            {isRefreshing ? (
              <>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Yuklanmoqda...
                </span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: progress >= 100 ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {progress >= 100 ? "Qo'yib yuborish" : 'Tortib yangilash'}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Content */}
      <motion.div style={{ y: springY }}>{children}</motion.div>
    </div>
  );
}
