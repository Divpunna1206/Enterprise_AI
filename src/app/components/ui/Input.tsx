import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-[18px] border-[2px] border-input bg-input-background px-4 py-3 text-sm font-medium shadow-[4px_4px_0_0_var(--color-border)]',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-4 focus:ring-warning/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus:ring-destructive/25',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
