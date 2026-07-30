import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'ultra' | 'full';
}

const maxWidthClasses = {
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  'ultra': 'max-w-[1700px]',
  full: 'max-w-full',
};

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className, maxWidth = 'ultra', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full pb-10 space-y-6', maxWidthClasses[maxWidth], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PageContainer.displayName = 'PageContainer';

