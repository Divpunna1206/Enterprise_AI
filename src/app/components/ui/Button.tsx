import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-border font-extrabold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-[4px_4px_0_0_var(--color-border)] hover:bg-primary-hover hover:text-white',
        secondary: 'bg-secondary text-secondary-foreground shadow-[4px_4px_0_0_var(--color-border)] hover:translate-y-[-1px]',
        success: 'bg-success text-success-foreground shadow-[4px_4px_0_0_var(--color-border)]',
        warning: 'bg-warning text-warning-foreground shadow-[4px_4px_0_0_var(--color-border)]',
        destructive: 'bg-destructive text-destructive-foreground shadow-[4px_4px_0_0_var(--color-border)]',
        outline: 'bg-background text-foreground shadow-[4px_4px_0_0_var(--color-border)] hover:bg-accent',
        ghost: 'border-transparent bg-transparent text-foreground shadow-none hover:border-border hover:bg-accent hover:shadow-[4px_4px_0_0_var(--color-border)]',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-14 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
