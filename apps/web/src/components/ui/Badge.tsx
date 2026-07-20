import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-600 text-primary-50 hover:bg-primary-600/80',
        secondary:
          'border-transparent bg-surface-100 text-surface-900 hover:bg-surface-100/80 dark:bg-surface-800 dark:text-surface-100',
        destructive:
          'border-transparent bg-red-500 text-red-50 hover:bg-red-500/80',
        outline: 'text-surface-950 dark:text-surface-50',
        success: 'border-transparent bg-emerald-500 text-white hover:bg-emerald-600',
        warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    );
  }
);

Badge.displayName = 'Badge';
