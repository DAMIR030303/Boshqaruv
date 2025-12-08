import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { useTheme } from '../useTheme';

// Mock useLocalStorage
const mockSetTheme = vi.fn();
vi.mock('../useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['light', mockSetTheme]),
}));

describe('useTheme', () => {
  let mockUseLocalStorage: ReturnType<
    typeof vi.mocked<typeof import('../useLocalStorage').useLocalStorage>
  >;

  beforeEach(async () => {
    mockUseLocalStorage = vi.mocked(
      (await import('../useLocalStorage')).useLocalStorage
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  it('returns light theme by default', () => {
    mockUseLocalStorage.mockReturnValue(['light', mockSetTheme]);
    const { result } = renderHook(() => useTheme());

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('returns dark theme when theme is dark', () => {
    mockUseLocalStorage.mockReturnValue(['dark', mockSetTheme]);
    const { result } = renderHook(() => useTheme());

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme from light to dark', () => {
    mockUseLocalStorage.mockReturnValue(['light', mockSetTheme]);
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockSetTheme).toHaveBeenCalledWith(expect.any(Function));

    // Call the function passed to setTheme
    const updaterFn = mockSetTheme.mock.calls[0][0];
    expect(updaterFn('light')).toBe('dark');
  });

  it('toggles theme from dark to light', () => {
    mockUseLocalStorage.mockReturnValue(['dark', mockSetTheme]);
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockSetTheme).toHaveBeenCalledWith(expect.any(Function));

    // Call the function passed to setTheme
    const updaterFn = mockSetTheme.mock.calls[0][0];
    expect(updaterFn('dark')).toBe('light');
  });

  it('applies dark class when theme changes to dark', () => {
    mockUseLocalStorage.mockReturnValue(['light', mockSetTheme]);
    const { rerender } = renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    mockUseLocalStorage.mockReturnValue(['dark', mockSetTheme]);
    rerender();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when theme changes to light', () => {
    mockUseLocalStorage.mockReturnValue(['dark', mockSetTheme]);
    const { rerender } = renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    mockUseLocalStorage.mockReturnValue(['light', mockSetTheme]);
    rerender();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
