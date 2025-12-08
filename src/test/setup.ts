import '@testing-library/jest-dom';
import { webcrypto as nodeWebCrypto } from 'node:crypto';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock crypto
const fallbackCrypto = globalThis.crypto ?? nodeWebCrypto ?? {};

const mockCrypto: Partial<Crypto> = {
  getRandomValues: <T extends ArrayBufferView | null>(arr: T): T => {
    if (arr instanceof Uint8Array) {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
    }
    return arr;
  },
  randomUUID: () => fallbackCrypto.randomUUID?.() ?? '',
  subtle: (fallbackCrypto.subtle ?? {}) as SubtleCrypto,
};

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: mockCrypto as Crypto,
});
