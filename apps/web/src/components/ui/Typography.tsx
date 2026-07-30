import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────────────────────────────────────
   Shared typography primitives.
   Every page should import these instead of hand-writing Tailwind heading classes.
   ────────────────────────────────────────────────────────────────────────────── */

// ─── Page Title (h1) ──────────────────────────────────────────────────────────
export const PageTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'text-[length:var(--text-h1)] leading-[var(--leading-h1)] font-bold tracking-tight text-white',
        className,
      )}
      {...props}
    />
  ),
);
PageTitle.displayName = 'PageTitle';

// ─── Page Subtitle ────────────────────────────────────────────────────────────
export const PageSubtitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'mt-1 text-[length:var(--text-body-sm)] leading-[var(--leading-body-sm)] text-surface-500 dark:text-surface-400',
        className,
      )}
      {...props}
    />
  ),
);
PageSubtitle.displayName = 'PageSubtitle';

// ─── Section Title (h2) ──────────────────────────────────────────────────────
export const SectionTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-[length:var(--text-h2)] leading-[var(--leading-h2)] font-semibold tracking-tight text-surface-900 dark:text-white',
        className,
      )}
      {...props}
    />
  ),
);
SectionTitle.displayName = 'SectionTitle';

// ─── Card Section Title (h3) ─────────────────────────────────────────────────
export const CardSectionTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold tracking-tight text-surface-900 dark:text-white',
        className,
      )}
      {...props}
    />
  ),
);
CardSectionTitle.displayName = 'CardSectionTitle';

// ─── Body text ────────────────────────────────────────────────────────────────
export const BodyText = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-[length:var(--text-body)] leading-[var(--leading-body)] text-surface-700 dark:text-surface-300',
        className,
      )}
      {...props}
    />
  ),
);
BodyText.displayName = 'BodyText';

// ─── Caption / Label ──────────────────────────────────────────────────────────
export const Caption = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'text-[length:var(--text-caption)] leading-[var(--leading-caption)] font-medium text-surface-500',
        className,
      )}
      {...props}
    />
  ),
);
Caption.displayName = 'Caption';
