import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, footer, className }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-surface-200 bg-white p-6 shadow-lg dark:border-surface-800 dark:bg-surface-950",
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          {children}
        </div>

        {footer && (
          <div className="mt-6 flex justify-end space-x-2 border-t border-surface-100 pt-4 dark:border-surface-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
