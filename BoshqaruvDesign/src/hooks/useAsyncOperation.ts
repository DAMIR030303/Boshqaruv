import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncOperationOptions {
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

export function useAsyncOperation<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: AsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const {
    retryCount = 3,
    retryDelay = 1000,
    timeout = 10000
  } = options;

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Execute async operation with retry logic
  const execute = useCallback(async (attempt = 0): Promise<void> => {
    if (!isMountedRef.current) return;

    // Cancel previous request
    cleanup();

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('İşlem zaman aşımına uğradı')), timeout);
      });

      // Race between async function and timeout
      const result = await Promise.race([
        asyncFunction(),
        timeoutPromise
      ]);

      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        setState({
          data: result,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
        const errorInstance = error instanceof Error ? error : new Error('Bilinmeyen xato');
        
        // Retry logic
        if (attempt < retryCount && errorInstance.message !== 'İşlem zaman aşımına uğradı') {
          setTimeout(() => {
            if (isMountedRef.current) {
              execute(attempt + 1);
            }
          }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorInstance
          }));
        }
      }
    }
  }, [asyncFunction, retryCount, retryDelay, timeout, cleanup]);

  // Manual retry function
  const retry = useCallback(() => {
    execute();
  }, [execute]);

  // Reset function
  const reset = useCallback(() => {
    cleanup();
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, [cleanup]);

  // Execute on mount and dependency changes
  useEffect(() => {
    execute();
    return cleanup;
  }, [execute, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    retry,
    reset
  };
}

// Simplified hook for data fetching
export function useAsyncData<T>(
  dataFetcher: () => Promise<T>,
  dependencies: any[] = [],
  options?: AsyncOperationOptions
) {
  return useAsyncOperation(dataFetcher, dependencies, options);
}

// Hook for mutations (POST, PUT, DELETE operations)
export function useAsyncMutation<T, P = any>(
  mutationFunction: (params: P) => Promise<T>,
  options?: AsyncOperationOptions
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const isMountedRef = useRef(true);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await mutationFunction(params);
      
      if (isMountedRef.current) {
        setState({
          data: result,
          loading: false,
          error: null
        });
      }
      
      return result;
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error('Bilinmeyen xato');
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorInstance
        }));
      }
      
      throw errorInstance;
    }
  }, [mutationFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
}