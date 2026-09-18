import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../lib/cn.js';

const buildPageWindow = (page, totalPages) => {
  const candidates = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...candidates].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);

  return sorted.flatMap((item, index) => {
    const previous = sorted[index - 1];
    return index > 0 && item - previous > 1 ? [{ gap: `gap-after-${previous}` }, item] : [item];
  });
};

export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null;

  const cellClass =
    'grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(cellClass, 'border border-ink-200 text-ink-700 hover:bg-ink-100')}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      {buildPageWindow(page, totalPages).map((item) =>
        typeof item === 'object' ? (
          <span key={item.gap} className="px-1 text-sm text-ink-400" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              cellClass,
              item === page
                ? 'bg-ink-950 font-medium text-white'
                : 'border border-ink-200 text-ink-700 hover:bg-ink-100',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(cellClass, 'border border-ink-200 text-ink-700 hover:bg-ink-100')}
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
}
