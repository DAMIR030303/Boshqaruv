import React, { ComponentType, Suspense } from 'react';

import { ErrorBoundary } from './ErrorBoundary';
import { LoadingFallback } from './LoadingFallback';

/**
 * Lazy route komponenti props
 */
interface LazyRouteProps {
  /** Lazy yuklanayotgan komponent */
  component: ComponentType<Record<string, unknown>>;
  /** Loading paytida ko'rsatiladigan xabar */
  message: string;
  /** Komponentga uzatiladigan props */
  props?: Record<string, unknown>;
}

/**
 * Lazy Route - Lazy loading komponentlari uchun umumiy wrapper
 *
 * Bu komponent takrorlangan Suspense va LoadingFallback pattern'ini
 * birlashtiradi va kod takrorlanishini kamaytiradi.
 *
 * @param props - LazyRouteProps
 * @returns JSX element
 */
export function LazyRoute({
  component: Component,
  message,
  props = {},
}: LazyRouteProps) {
  console.log('[LazyRoute] Rendering component with message:', message);
  console.log('[LazyRoute] Component:', Component);
  console.log('[LazyRoute] Props keys:', Object.keys(props));

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-red-500 dark:text-red-400 mb-2">
              Xato yuz berdi
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Komponent yuklanmadi
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Sahifani yangilash
            </button>
          </div>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <LoadingFallback message={message} />
          </div>
        }
      >
        <ComponentWrapper Component={Component} props={props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Component wrapper with error handling and timeout
 */
function ComponentWrapper({
  Component,
  props,
}: {
  Component: ComponentType<Record<string, unknown>>;
  props: Record<string, unknown>;
}) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Timeout - agar komponent 15 soniyada yuklanmasa, xato ko'rsatish
    // Timeout'ni oshirdik, chunki ba'zi komponentlar yuklanishi uzoqroq vaqt olishi mumkin
    const timeout = setTimeout(() => {
      if (isLoading && !hasError) {
        console.warn('[LazyRoute] Component loading timeout');
        setHasError(true);
        setError(new Error('Komponent yuklanishi juda uzoq davom etdi'));
        setIsLoading(false);
      }
    }, 15000); // 15 soniyaga oshirdik

    return () => clearTimeout(timeout);
  }, [isLoading, hasError]);

  React.useEffect(() => {
    // Komponent yuklanganda loading holatini o'zgartirish
    setIsLoading(false);
  }, []);

  try {
    console.log('[LazyRoute] Rendering Component...');

    if (hasError && error) {
      throw error;
    }

    const result = <Component {...props} />;
    console.log('[LazyRoute] Component rendered successfully');
    return result;
  } catch (error) {
    console.error('[LazyRoute] Error in ComponentWrapper:', error);

    // Fallback UI
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-red-500 dark:text-red-400 mb-2">
            Komponent yuklanmadi
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : "Noma'lum xato"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sahifani yangilash
          </button>
        </div>
      </div>
    );
  }
}
