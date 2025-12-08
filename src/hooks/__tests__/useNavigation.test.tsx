import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { useNavigation } from '../useNavigation';

// Mock useLocalStorage
const mockSetActiveTab = vi.fn();
vi.mock('../useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['dashboard', mockSetActiveTab]),
}));

describe('useNavigation', () => {
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
  });

  it('returns dashboard as default active tab', () => {
    mockUseLocalStorage.mockReturnValue(['dashboard', mockSetActiveTab]);
    const { result } = renderHook(() => useNavigation());

    expect(result.current.activeTab).toBe('dashboard');
  });

  it('returns stored active tab from localStorage', () => {
    mockUseLocalStorage.mockReturnValue(['tasks', mockSetActiveTab]);
    const { result } = renderHook(() => useNavigation());

    expect(result.current.activeTab).toBe('tasks');
  });

  it('navigates to a new tab', () => {
    mockUseLocalStorage.mockReturnValue(['dashboard', mockSetActiveTab]);
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.handleNavigate('employees');
    });

    expect(mockSetActiveTab).toHaveBeenCalledWith('employees');
  });

  it('navigates to different tabs', () => {
    mockUseLocalStorage.mockReturnValue(['dashboard', mockSetActiveTab]);
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.handleNavigate('tasks');
    });
    expect(mockSetActiveTab).toHaveBeenCalledWith('tasks');

    act(() => {
      result.current.handleNavigate('reports');
    });
    expect(mockSetActiveTab).toHaveBeenCalledWith('reports');
  });

  it('updates active tab when localStorage value changes', () => {
    mockUseLocalStorage.mockReturnValue(['dashboard', mockSetActiveTab]);
    const { result, rerender } = renderHook(() => useNavigation());

    expect(result.current.activeTab).toBe('dashboard');

    mockUseLocalStorage.mockReturnValue(['tasks', mockSetActiveTab]);
    rerender();

    expect(result.current.activeTab).toBe('tasks');
  });
});
