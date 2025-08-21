import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { Loader2 } from 'lucide-react';

// Boshqaruv/Components/Button
// Developer-ready button component with full accessibility support

const buttonVariants = cva(
  // Base styles - following 8-pt grid and Auto Layout
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      // Tone variants
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]',
        success: 'bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:scale-[1.02] active:scale-[0.98]',
        warning: 'bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:scale-[1.02] active:scale-[0.98]',
        danger: 'bg-danger text-danger-foreground shadow-sm hover:bg-danger/90 hover:scale-[1.02] active:scale-[0.98]',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]',
        ghost: 'hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline hover:scale-[1.02] active:scale-[0.98]',
      },
      // Size variants - following 8-pt grid
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-3', // 32px height
        md: 'h-10 px-6 text-sm [&_svg]:size-4', // 40px height  
        lg: 'h-12 px-8 text-base [&_svg]:size-5', // 48px height
        icon: 'h-10 w-10 [&_svg]:size-4',
        'icon-sm': 'h-8 w-8 [&_svg]:size-3',
        'icon-lg': 'h-12 w-12 [&_svg]:size-5',
      },
      // State variants
      state: {
        default: '',
        loading: 'cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      state: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  'aria-label'?: string; // Required for accessibility
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant, 
      size, 
      asChild = false, 
      loading = false,
      loadingText = 'Yuklanmoqda...',
      children,
      disabled,
      'aria-label': ariaLabel,
      ...props 
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant, 
            size, 
            state: loading ? 'loading' : 'default',
            className 
          })
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={ariaLabel}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        {...props}
      >
        {loading && (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            {loadingText && <span className="sr-only">{loadingText}</span>}
          </>
        )}
        {loading ? (loadingText || children) : children}
      </Comp>
    );
  }
);
Button.displayName = 'BoshqaruvButton';

export { Button, buttonVariants };