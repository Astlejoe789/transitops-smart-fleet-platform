import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTitle, PageSubtitle } from '../ui/Typography';

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backHref?: string;
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, subtitle, actions, backHref, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-4">
          {backHref && (
            <Link
              to={backHref}
              className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-800/50 text-surface-400 shadow-sm ring-1 ring-inset ring-surface-700/30 transition-colors hover:text-white hover:bg-surface-700/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div>
            <PageTitle>{title}</PageTitle>
            {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';
