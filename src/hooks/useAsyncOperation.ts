import { useState, useCallback } from 'react';

interface UseAsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncOperationReturn<T, Args extends unknown[] = unknown[]> extends UseAsyncOperationState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

export function useAsyncOperation<T = unknown, Args extends unknown[] = unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  initialData: T | null = null
): UseAsyncOperationReturn<T, Args> {
  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await asyncFunction(...args);
        setState(prev => ({ ...prev, data: result, loading: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}
