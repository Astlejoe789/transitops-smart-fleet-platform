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
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-start gap-4 justify-between w-full">
            <div className="flex items-start gap-4">
              {backHref && (
                <Link
                  to={backHref}
                  className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              )}
              <div>
                {subtitle && (
                  <span className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-[#0066B3] bg-[#E8F2FB] dark:bg-[rgba(0,102,179,0.2)] px-3 py-1 rounded-full mb-3">
                    {subtitle}
                  </span>
                )}
                <PageTitle>{title}</PageTitle>
              </div>
            </div>

            {actions && (
              <div className="flex shrink-0 items-center gap-3">{actions}</div>
            )}
          </div>
          <div className="w-12 h-1 bg-[#0066B3] rounded-full mt-4" />
        </div>
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';
