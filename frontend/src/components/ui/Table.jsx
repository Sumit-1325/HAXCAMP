import { Skeleton } from './Skeleton.jsx';
import { cn } from '../../lib/cn.js';

export function Table({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  skeletonRows = 5,
  emptyState = null,
  className,
}) {
  if (!isLoading && rows.length === 0 && emptyState) {
    return emptyState;
  }

  return (
    <div className={cn('overflow-x-auto rounded-card border border-ink-200 bg-white', className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-200">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-xs font-medium tracking-wider text-ink-500 uppercase',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-ink-200">
          {isLoading
            ? Array.from({ length: skeletonRows }, (_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <Skeleton className="h-4 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={getRowKey(row)} className="transition hover:bg-ink-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-4 py-3.5 text-sm text-ink-700', column.className)}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
