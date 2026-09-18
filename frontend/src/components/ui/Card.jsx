import { cn } from '../../lib/cn.js';

export function Card({ title, description, action, className, bodyClassName, children }) {
  const hasHeader = Boolean(title || action);

  return (
    <section className={cn('rounded-card border border-ink-200 bg-white', className)}>
      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-200 px-5 py-4">
          <div>
            {title ? <h2 className="text-base font-semibold text-ink-900">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}

      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-ink-500">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
