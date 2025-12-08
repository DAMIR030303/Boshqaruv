import React, { Component, ErrorInfo, ReactNode } from 'react';

import { getTranslation } from '../i18n';
import { logger } from '../utils/logger';

import { ErrorState } from './ui/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Errors are logged to monitoring service in production
    logger.error('ErrorBoundary caught an error', error);
    console.error('[ErrorBoundary] Error details:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // Android WebView uchun qo'shimcha logging
    if (typeof window !== 'undefined' && window.navigator) {
      const isAndroid = /Android/i.test(window.navigator.userAgent);
      if (isAndroid) {
        console.error('[ErrorBoundary] Android WebView detected');
        console.error(
          '[ErrorBoundary] User agent:',
          window.navigator.userAgent
        );
      }
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // i18n helper
      const t = (key: string) => getTranslation(key, 'uz');

      const errorMessage = this.state.error?.message;
      const description = errorMessage
        ? t('errors.generic.descriptionWithError').replace(
            '{error}',
            errorMessage
          )
        : t('errors.generic.description');

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-md w-full">
            <ErrorState
              variant="generic"
              title={t('errors.generic.title')}
              description={description}
              onRetry={this.handleRetry}
              onHome={this.handleRefresh}
            />
            {this.state.error &&
              import.meta.env.VITE_APP_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                    {t('errors.generic.details')}
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-300 overflow-auto">
                    {this.state.error.stack || this.state.error.message}
                  </pre>
                </details>
              )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
