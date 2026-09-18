import { AlertTriangle, RotateCw } from 'lucide-react';

import { Button } from './Button.jsx';

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center rounded-card border border-red-200 bg-red-50/50 px-6 py-14 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle aria-hidden="true" className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-base font-semibold text-ink-900">{title}</h2>
        {message ? <p className="mt-1.5 max-w-md text-sm text-ink-600">{message}</p> : null}
        {onRetry ? (
          <Button variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
            <RotateCw aria-hidden="true" className="h-4 w-4" />
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
