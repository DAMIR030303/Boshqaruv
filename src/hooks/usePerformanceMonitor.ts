import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  threshold?: number;
}

export function usePerformanceMonitor(
  componentName: string,
  options: UsePerformanceMonitorOptions = {}
) {
  const { enabled = true, logToConsole = false, threshold = 16 } = options;
  const renderStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics[]>([]);

  const startRender = useCallback(() => {
    if (!enabled) return;
    renderStartTime.current = performance.now();
  }, [enabled]);

  const endRender = useCallback(() => {
    if (!enabled) return;
    
    const renderTime = performance.now() - renderStartTime.current;
    const timestamp = Date.now();
    
    // Get memory usage if available
    let memoryUsage: number | undefined;
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }

    const metric: PerformanceMetrics = {
      renderTime,
      memoryUsage,
      timestamp,
    };

    metrics.current.push(metric);

    // Keep only last 100 metrics
    if (metrics.current.length > 100) {
      metrics.current = metrics.current.slice(-100);
    }

    // Log slow renders
    if (renderTime > threshold && logToConsole) {
      if (import.meta.env.VITE_APP_ENV === 'development') {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }
    }

    return metric;
  }, [enabled, componentName, threshold, logToConsole]);

  const getMetrics = useCallback(() => {
    return {
      current: metrics.current[metrics.current.length - 1],
      history: [...metrics.current],
      average: metrics.current.length > 0 
        ? metrics.current.reduce((sum, m) => sum + m.renderTime, 0) / metrics.current.length 
        : 0,
      slowRenders: metrics.current.filter(m => m.renderTime > threshold).length,
    };
  }, [threshold]);

  const clearMetrics = useCallback(() => {
    metrics.current = [];
  }, []);

  // Auto-start render timing
  useEffect(() => {
    startRender();
    const cleanup = () => {
      endRender();
    };
    return cleanup;
  });

  return {
    startRender,
    endRender,
    getMetrics,
    clearMetrics,
  };
}
