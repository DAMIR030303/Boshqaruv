import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

// Boshqaruv/Components/Input
// Developer-ready input component with full accessibility support

const inputVariants = cva(
  // Base styles - following 8-pt grid and Auto Layout
  'flex w-full rounded-md border bg-input-background px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      // Size variants - following 8-pt grid
      size: {
        sm: 'h-8 px-3 py-1 text-xs', // 32px height
        md: 'h-10 px-4 py-3 text-sm', // 40px height
        lg: 'h-12 px-6 py-4 text-base', // 48px height
      },
      // State variants
      variant: {
        default: 'border-border focus-visible:border-primary',
        error: 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
        success: 'border-success focus-visible:border-success focus-visible:ring-success/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

type VariantInputs = VariantProps<typeof inputVariants>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantInputs {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      className, 
      type = 'text',
      size, 
      variant,
      label,
      helperText,
      errorMessage,
      disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      id,
      ...props 
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputId] = React.useState(id || `input-${Math.random().toString(36).substr(2, 9)}`);
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const currentVariant = errorMessage ? 'error' : variant;
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    const describedBy = React.useMemo(() => {
      const ids = [ariaDescribedBy];
      if (helperText) ids.push(helperTextId);
      if (errorMessage) ids.push(errorId);
      return ids.filter(Boolean).join(' ');
    }, [ariaDescribedBy, helperText, errorMessage, helperTextId, errorId]);

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && (
              <span className="text-danger ml-1" aria-label="Majburiy maydon">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <input
            id={inputId}
            type={inputType}
            className={cn(
              inputVariants({ size: size as VariantInputs['size'], variant: currentVariant as VariantInputs['variant'] }),
              type === 'password' && 'pr-12', // Space for password toggle
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-label={ariaLabel || label}
            aria-describedby={describedBy || undefined}
            aria-invalid={errorMessage ? 'true' : 'false'}
            {...props}
          />

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}

          {/* Error Icon */}
          {errorMessage && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-danger">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && !errorMessage && (
          <p 
            id={helperTextId}
            className="text-xs text-muted-foreground"
            role="note"
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p 
            id={errorId}
            className="text-xs text-danger flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'BoshqaruvInput';

export { Input, inputVariants };

// Specialized Input Components

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  'aria-label'?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { 
      className, 
      label,
      helperText,
      errorMessage,
      disabled,
      'aria-label': ariaLabel,
      id,
      ...props 
    },
    ref
  ) => {
    const [textareaId] = React.useState(id || `textarea-${Math.random().toString(36).substr(2, 9)}`);
    const helperTextId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    const describedBy = React.useMemo(() => {
      const ids = [];
      if (helperText) ids.push(helperTextId);
      if (errorMessage) ids.push(errorId);
      return ids.join(' ') || undefined;
    }, [helperText, errorMessage, helperTextId, errorId]);

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && (
              <span className="text-danger ml-1" aria-label="Majburiy maydon">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-border bg-input-background px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            errorMessage && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
            className
          )}
          ref={ref}
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-describedby={describedBy}
          aria-invalid={errorMessage ? 'true' : 'false'}
          {...props}
        />

        {/* Helper Text */}
        {helperText && !errorMessage && (
          <p 
            id={helperTextId}
            className="text-xs text-muted-foreground"
            role="note"
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p 
            id={errorId}
            className="text-xs text-danger flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'BoshqaruvTextarea';

export { Textarea };
// Usage examples and documentation are available in README; removed raw JSX examples from source.