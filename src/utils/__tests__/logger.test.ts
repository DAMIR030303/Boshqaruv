import { describe, expect, it, vi, beforeEach } from 'vitest';

import { logger, measurePerformance } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearLogBuffer();
    // Set environment to development for these tests
    vi.stubEnv('VITE_APP_ENV', 'development');
  });

  describe('debug', () => {
    it('adds entry to log buffer', () => {
      logger.debug('Debug message', { data: 'test' });
      const buffer = logger.getLogBuffer();
      expect(buffer.length).toBe(1);
      expect(buffer[0].level).toBe('debug');
      expect(buffer[0].message).toBe('Debug message');
    });
  });

  describe('info', () => {
    it('adds entry to log buffer', () => {
      logger.info('Info message');
      const buffer = logger.getLogBuffer();
      expect(buffer.length).toBe(1);
      expect(buffer[0].level).toBe('info');
    });
  });

  describe('warn', () => {
    it('adds entry to log buffer', () => {
      logger.warn('Warning message');
      const buffer = logger.getLogBuffer();
      expect(buffer.length).toBe(1);
      expect(buffer[0].level).toBe('warn');
    });
  });

  describe('error', () => {
    it('adds entry to log buffer with error data', () => {
      const error = new Error('Test error');
      logger.error('Error message', error);
      const buffer = logger.getLogBuffer();
      expect(buffer.length).toBe(1);
      expect(buffer[0].level).toBe('error');
      expect(buffer[0].data).toBe(error);
      expect(buffer[0].stack).toBe(error.stack);
    });

    it('handles non-Error objects', () => {
      logger.error('Error message', { code: 500 });
      const buffer = logger.getLogBuffer();
      expect(buffer[0].data).toEqual({ code: 500 });
    });
  });

  describe('getLogBuffer', () => {
    it('returns copy of log buffer', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      const buffer1 = logger.getLogBuffer();
      const buffer2 = logger.getLogBuffer();
      expect(buffer1).not.toBe(buffer2);
      expect(buffer1).toEqual(buffer2);
    });
  });

  describe('clearLogBuffer', () => {
    it('clears log buffer', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      expect(logger.getLogBuffer().length).toBe(2);

      logger.clearLogBuffer();
      expect(logger.getLogBuffer().length).toBe(0);
    });
  });

  describe('log buffer size limit', () => {
    it('limits buffer size to maxBufferSize', () => {
      for (let i = 0; i < 150; i++) {
        logger.info(`Message ${i}`);
      }
      const buffer = logger.getLogBuffer();
      expect(buffer.length).toBeLessThanOrEqual(100);
    });
  });
});

describe('measurePerformance', () => {
  it('executes function', () => {
    const fn = vi.fn();
    measurePerformance('test', fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
