import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '../../lib/cn.js';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

export function Modal({ isOpen, onClose, title, description, size = 'md', footer, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-ink-950/40"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full rounded-card border border-ink-200 bg-white shadow-xl outline-none',
          SIZES[size] ?? SIZES.md,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-m-1 rounded-md p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-ink-200 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
