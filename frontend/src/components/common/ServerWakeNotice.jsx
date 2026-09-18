import { AlertTriangle, Loader2 } from 'lucide-react';

import { cn } from '../../lib/cn.js';

export function ServerWakeNotice({ status }) {
  if (status !== 'waking' && status !== 'unreachable') return null;

  const isWaking = status === 'waking';

  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 text-center text-sm',
        isWaking ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700',
      )}
    >
      {isWaking ? (
        <>
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Waking up the server — free hosting sleeps when idle, this can take up to a minute.
        </>
      ) : (
        <>
          <AlertTriangle aria-hidden="true" className="h-4 w-4" />
          Cannot reach the server right now. Some content may not load.
        </>
      )}
    </div>
  );
}
