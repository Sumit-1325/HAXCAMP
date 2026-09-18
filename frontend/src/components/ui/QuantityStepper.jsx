import { Minus, Plus } from 'lucide-react';

import { cn } from '../../lib/cn.js';

export function QuantityStepper({ value, onChange, min = 1, max = 99, disabled = false, className }) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  const buttonClass =
    'grid h-9 w-9 place-items-center text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-ink-200 bg-white',
        disabled && 'opacity-60',
        className,
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={cn(buttonClass, 'rounded-l-full')}
      >
        <Minus aria-hidden="true" className="h-4 w-4" />
      </button>

      <span aria-live="polite" className="w-9 text-center text-sm font-medium text-ink-900 tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={cn(buttonClass, 'rounded-r-full')}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
