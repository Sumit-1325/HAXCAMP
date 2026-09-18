import { cn } from '../../lib/cn.js';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-ink-200 bg-white px-6 py-16 text-center',
        className,
      )}
    >
      {Icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-100 text-ink-500">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
      ) : null}
      <h2 className="mt-4 text-base font-semibold text-ink-900">{title}</h2>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
