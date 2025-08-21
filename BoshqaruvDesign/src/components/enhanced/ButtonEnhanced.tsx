import { forwardRef } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import { VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
        neutral: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        success: "bg-success text-success-foreground shadow hover:bg-success/90",
        warning: "bg-warning text-warning-foreground shadow hover:bg-warning/90",
        danger: "bg-danger text-danger-foreground shadow hover:bg-danger/90",
        outline: "border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonEnhancedProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const ButtonEnhanced = forwardRef<HTMLButtonElement, ButtonEnhancedProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    iconLeft, 
    iconRight, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    // Map our custom variants to shadcn variants when possible
    const shadcnVariant = variant === 'primary' ? 'default' :
                         variant === 'neutral' ? 'secondary' :
                         variant === 'danger' ? 'destructive' :
                         variant;
    
    const shadcnSize = size === 'md' ? 'default' : size;

    const customClasses = cn(
      // Apply custom styling for variants not supported by shadcn
      variant === 'success' && "bg-success text-success-foreground shadow hover:bg-success/90",
      variant === 'warning' && "bg-warning text-warning-foreground shadow hover:bg-warning/90",
      variant === 'primary' && "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
      variant === 'neutral' && "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      className
    );

    return (
      <Button
        ref={ref}
        variant={['success', 'warning', 'primary', 'neutral'].includes(variant) ? 'default' : shadcnVariant as any}
        size={shadcnSize as any}
        className={customClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Yuklanmoqda...
          </>
        ) : (
          <>
            {iconLeft && iconLeft}
            {children}
            {iconRight && iconRight}
          </>
        )}
      </Button>
    );
  }
);

ButtonEnhanced.displayName = "ButtonEnhanced";

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn("flex [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none", className)}>
      {children}
    </div>
  );
}

// Floating Action Button
interface FABProps extends ButtonEnhancedProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({ 
  position = 'bottom-right', 
  className, 
  children, 
  ...props 
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <ButtonEnhanced
      size="lg"
      className={cn(
        "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50",
        positionClasses[position],
        className
      )}
      {...props}
    >
      {children}
    </ButtonEnhanced>
  );
}

export { ButtonEnhanced, buttonVariants };