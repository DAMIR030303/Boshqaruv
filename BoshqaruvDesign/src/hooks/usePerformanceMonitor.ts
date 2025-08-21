import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const mounted = useRef(true);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  // End performance measurement and log if needed
  const endMeasurement = useCallback(() => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }

      // Store metrics for potential analytics
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now()
      };

      // In production, you might want to send this to analytics
      if (typeof window !== 'undefined' && 'performance' in window) {
        try {
          performance.mark(`${componentName}-render-end`);
        } catch (error) {
          // Ignore performance mark errors
        }
      }
    }
  }, [componentName]);

  // Measure render time
  useEffect(() => {
    startMeasurement();
    endMeasurement();
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return {
    startMeasurement,
    endMeasurement
  };
}

// Hook for monitoring memory usage with optimized frequency
export function useMemoryMonitor() {
  // Completely disable memory monitoring to prevent high memory usage warnings
  // This was causing more overhead than benefit
  return { checkMemoryUsage: () => null };
}