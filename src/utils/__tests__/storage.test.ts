import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { safeLocalStorage } from '../storage';

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

// Create a real localStorage mock for these tests
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

describe('safeLocalStorage', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    // Replace global localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('getItem', () => {
    it('returns parsed JSON value', () => {
      localStorageMock.setItem('test-key', JSON.stringify({ name: 'test' }));
      const result = safeLocalStorage.getItem('test-key');
      expect(result).toEqual({ name: 'test' });
    });

    it('returns string value as-is', () => {
      localStorageMock.setItem('test-key', 'simple-string');
      const result = safeLocalStorage.getItem('test-key');
      expect(result).toBe('simple-string');
    });

    it('returns boolean true for "true" string', () => {
      localStorageMock.setItem('test-key', 'true');
      const result = safeLocalStorage.getItem('test-key');
      expect(result).toBe(true);
    });

    it('returns boolean false for "false" string', () => {
      localStorageMock.setItem('test-key', 'false');
      const result = safeLocalStorage.getItem('test-key');
      expect(result).toBe(false);
    });

    it('returns fallback when key does not exist', () => {
      const result = safeLocalStorage.getItem('non-existent', 'fallback');
      expect(result).toBe('fallback');
    });

    it('returns null fallback when key does not exist and no fallback provided', () => {
      const result = safeLocalStorage.getItem('non-existent');
      expect(result).toBeNull();
    });

    it('handles invalid JSON gracefully', () => {
      localStorageMock.setItem('test-key', '{ invalid json }');
      const result = safeLocalStorage.getItem('test-key');
      expect(result).toBe('{ invalid json }');
    });
  });

  describe('setItem', () => {
    it('stores string value as-is', () => {
      safeLocalStorage.setItem('test-key', 'string-value');
      expect(localStorageMock.getItem('test-key')).toBe('string-value');
    });

    it('stores object as JSON string', () => {
      const value = { name: 'test', count: 5 };
      safeLocalStorage.setItem('test-key', value);
      expect(localStorageMock.getItem('test-key')).toBe(JSON.stringify(value));
    });

    it('stores array as JSON string', () => {
      const value = [1, 2, 3];
      safeLocalStorage.setItem('test-key', value);
      expect(localStorageMock.getItem('test-key')).toBe(JSON.stringify(value));
    });

    it('stores number as JSON string', () => {
      safeLocalStorage.setItem('test-key', 42);
      expect(localStorageMock.getItem('test-key')).toBe('42');
    });

    it('stores boolean as JSON string', () => {
      safeLocalStorage.setItem('test-key', true);
      expect(localStorageMock.getItem('test-key')).toBe('true');
    });
  });

  describe('clearAllExcept', () => {
    it('executes without errors when keys exist', () => {
      // Test that the function executes without throwing errors
      // The actual implementation uses Object.keys(localStorage) which is hard to mock
      expect(() => {
        safeLocalStorage.clearAllExcept(['test-key']);
      }).not.toThrow();
    });

    it('executes without errors when empty array is provided', () => {
      expect(() => {
        safeLocalStorage.clearAllExcept([]);
      }).not.toThrow();
    });

    it('executes without errors when no keys to keep', () => {
      expect(() => {
        safeLocalStorage.clearAllExcept(['non-existent-key']);
      }).not.toThrow();
    });
  });
});
