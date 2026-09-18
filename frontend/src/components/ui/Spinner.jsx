import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/cn.js';

export function Spinner({ className, label = 'Loading' }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-ink-500">
      <Loader2 aria-hidden="true" className={cn('h-5 w-5 animate-spin', className)} />
      <span className="text-sm">{label}</span>
    </span>
  );
}

export function CenteredSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <Spinner label={label} />
    </div>
  );
}
