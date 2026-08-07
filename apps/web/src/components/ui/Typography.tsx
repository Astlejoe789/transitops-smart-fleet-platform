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
        'text-3xl md:text-4xl leading-tight font-extrabold tracking-tight text-slate-900 dark:text-white',
        "font-['Outfit','Inter',sans-serif]",
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
        'mt-2 text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400',
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
        'text-2xl font-bold tracking-tight text-slate-900 dark:text-white',
        "font-['Outfit','Inter',sans-serif]",
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
        'text-xl font-bold tracking-tight text-slate-900 dark:text-white',
        "font-['Outfit','Inter',sans-serif]",
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
        'text-sm leading-relaxed text-slate-700 dark:text-slate-300',
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
