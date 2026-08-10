import type { ReactNode} from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-[var(--radius-3xl)] border border-surface-800 bg-surface-950 p-4 sm:p-6 shadow-lg',
              className
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-[length:var(--text-h3)] leading-[var(--leading-h3)] font-semibold text-white">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-[length:var(--text-body-sm)] text-surface-400">
                    {description}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-2 shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              {children}
            </div>

            {footer && (
              <div className="mt-6 flex justify-end space-x-2 border-t border-surface-800 pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
