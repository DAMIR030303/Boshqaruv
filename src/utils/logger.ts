/**
 * Production-ready logging utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  stack?: string;
}

class Logger {
  private isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    // Add to buffer for error reporting
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Only log to console in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}]`, message, data || '');
    }

    // In production, send to monitoring service
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      this.sendToMonitoring(entry);
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      data: error,
      stack: error instanceof Error ? error.stack : undefined
    };

    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    if (this.isDevelopment) {
      console.error(`[ERROR]`, message, error || '');
    }

    this.sendToMonitoring(entry);
  }

  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  clearLogBuffer(): void {
    this.logBuffer = [];
  }

  private sendToMonitoring(entry: LogEntry): void {
    // In production, send to error tracking service like Sentry
    // For now, store in localStorage for debugging
    try {
      const errorLogs = localStorage.getItem('boshqaruv-error-logs');
      const logs = errorLogs ? JSON.parse(errorLogs) : [];
      logs.push(entry);
      
      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      localStorage.setItem('boshqaruv-error-logs', JSON.stringify(logs));
    } catch {
      // Silently fail if localStorage is full
    }
  }
}

export const logger = new Logger();

// Performance monitoring helper
export const measurePerformance = (name: string, fn: () => void): void => {
  if (import.meta.env.VITE_APP_ENV === 'development') {
    const start = performance.now();
    fn();
    const end = performance.now();
    logger.debug(`Performance: ${name} took ${(end - start).toFixed(2)}ms`);
  } else {
    fn();
  }
};