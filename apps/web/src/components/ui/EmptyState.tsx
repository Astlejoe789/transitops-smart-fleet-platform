import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  compact?: boolean;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, compact = false, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[18px] border border-dashed border-surface-700/50 bg-surface-900/30 text-center',
        compact ? 'p-8 min-h-[200px]' : 'p-16 min-h-[400px]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary-900/30',
          compact ? 'h-12 w-12' : 'h-16 w-16'
        )}
      >
        <Icon className={cn('text-primary-400', compact ? 'h-6 w-6' : 'h-8 w-8')} />
      </div>
      <h3
        className={cn(
          'mt-4 font-semibold text-white',
          compact
            ? 'text-[length:var(--text-section)]'
            : 'text-[length:var(--text-h3)] leading-[var(--leading-h3)]'
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'mt-2 max-w-sm text-surface-400',
          compact ? 'text-[length:var(--text-caption)]' : 'text-[length:var(--text-body-sm)]'
        )}
      >
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} disabled={action.disabled} className={compact ? 'mt-4' : 'mt-8'}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
