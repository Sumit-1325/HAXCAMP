import { useId } from 'react';

import { cn } from '../../lib/cn.js';

// Every control needs the same label / error / hint wiring, so it lives here
// once instead of being repeated in Input, Select and Textarea.
export const useFieldId = (id) => {
  const generated = useId();
  return id ?? generated;
};

export const fieldControlClass = (hasError) =>
  cn(
    'w-full rounded-xl border bg-white text-sm text-ink-900 transition',
    'placeholder:text-ink-400',
    'focus:outline-none focus:ring-4',
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-500/15',
    'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
  );

export function Field({ id, label, error, hint, required, className, children }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-ink-800">
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
