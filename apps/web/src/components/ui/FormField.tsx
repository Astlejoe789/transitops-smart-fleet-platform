import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  children,
  error,
  helperText,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-[length:var(--text-body-sm)] font-medium text-surface-300">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[length:var(--text-caption)] font-medium text-danger">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-[length:var(--text-caption)] text-surface-500">{helperText}</p>
      )}
    </div>
  );
}
