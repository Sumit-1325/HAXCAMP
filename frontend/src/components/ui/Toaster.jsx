import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import { cn } from '../../lib/cn.js';

const TONES = {
  success: { Icon: CheckCircle2, iconClass: 'text-emerald-600' },
  error: { Icon: AlertCircle, iconClass: 'text-red-600' },
  info: { Icon: Info, iconClass: 'text-accent-600' },
};

export function Toaster({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map(({ id, tone, message }) => {
        const { Icon, iconClass } = TONES[tone] ?? TONES.info;

        return (
          <div
            key={id}
            role="status"
            className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-ink-200 bg-white p-3.5 shadow-lg shadow-ink-950/5"
          >
            <Icon aria-hidden="true" className={cn('mt-0.5 h-5 w-5 shrink-0', iconClass)} />
            <p className="flex-1 text-sm leading-6 text-ink-800">{message}</p>
            <button
              type="button"
              onClick={() => onDismiss(id)}
              aria-label="Dismiss notification"
              className="-m-1 rounded-md p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
