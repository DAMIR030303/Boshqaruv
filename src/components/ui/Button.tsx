import React, { forwardRef, memo } from 'react';

import { clsx } from 'clsx';

export type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button varianti */
  variant?: Variant;
  /** Button o'lchami */
  size?: ButtonSize;
  /** To'liq kenglik */
  fullWidth?: boolean;
  /** Chap tarafdagi icon */
  leftIcon?: React.ReactNode;
  /** O'ng tarafdagi icon */
  rightIcon?: React.ReactNode;
  /** Yuklanish holati */
  isLoading?: boolean;
  /** Responsive - mobile'da to'liq kenglik */
  responsive?: boolean;
}

/**
 * Responsive Button komponenti
 * Barcha qurilmalarda to'g'ri ishlaydi
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        children,
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        leftIcon,
        rightIcon,
        isLoading = false,
        responsive = false,
        disabled,
        ...props
      },
      ref
    ) => {
      const variantClasses: Record<Variant, string> = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
        warning: 'btn-warning',
      };

      const sizeClasses: Record<ButtonSize, string> = {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
      };

      return (
        <button
          ref={ref}
          className={clsx(
            'btn',
            variantClasses[variant],
            sizeClasses[size],
            fullWidth && 'w-full',
            responsive && 'btn-responsive',
            className
          )}
          disabled={isLoading || disabled}
          {...props}
        >
          {/* Loading spinner */}
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          {/* Left icon */}
          {leftIcon && !isLoading && (
            <span className="mr-2 -ml-1 inline-flex">{leftIcon}</span>
          )}

          {/* Button text */}
          <span className={clsx(isLoading && 'opacity-80')}>{children}</span>

          {/* Right icon */}
          {rightIcon && (
            <span className="ml-2 -mr-1 inline-flex">{rightIcon}</span>
          )}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

/**
 * Icon Button komponenti
 */
export const IconButton = memo(
  ({
    className,
    children,
    variant = 'ghost',
    size = 'md',
    ...props
  }: Omit<
    ButtonProps,
    'leftIcon' | 'rightIcon' | 'fullWidth' | 'responsive'
  >) => {
    return (
      <button
        className={clsx(
          'btn-icon',
          size === 'sm' && 'p-1',
          size === 'md' && 'p-2',
          size === 'lg' && 'p-3',
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'ghost' && 'btn-ghost',
          variant === 'danger' && 'btn-danger',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
