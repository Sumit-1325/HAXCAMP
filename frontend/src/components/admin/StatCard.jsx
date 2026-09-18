import { cn } from '../../lib/cn.js';

const TONES = {
  default: 'bg-ink-100 text-ink-700',
  accent: 'bg-accent-50 text-accent-700',
  warning: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
};

export function StatCard({ label, value, hint, Icon, tone = 'default' }) {
  return (
    <div className="rounded-card border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">{label}</p>
        {Icon ? (
          <span
            className={cn(
              'grid h-8 w-8 place-items-center rounded-lg',
              TONES[tone] ?? TONES.default,
            )}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink-950 tabular-nums">{value}</p>
      {hint ? <p className="mt-1.5 text-sm text-ink-500">{hint}</p> : null}
    </div>
  );
}
