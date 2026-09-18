import { formatPrice, pluralize } from '../../lib/format.js';

export function CartSummary({ itemCount, subtotal, children, footer }) {
  return (
    <aside className="rounded-card border border-ink-200 bg-white p-5 lg:sticky lg:top-24">
      <h2 className="text-base font-semibold text-ink-900">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-ink-500">Items</dt>
          <dd className="text-ink-900 tabular-nums">{pluralize(itemCount, 'item')}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-ink-500">Subtotal</dt>
          <dd className="text-ink-900 tabular-nums">{formatPrice(subtotal)}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-ink-500">Delivery</dt>
          <dd className="text-ink-900">Free</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-ink-200 pt-5">
        <span className="text-base font-semibold text-ink-900">Total</span>
        <span className="text-lg font-semibold text-ink-950 tabular-nums">
          {formatPrice(subtotal)}
        </span>
      </div>

      {children ? <div className="mt-5">{children}</div> : null}

      <p className="mt-4 text-xs leading-5 text-ink-400">
        Cash on delivery. The final amount is recalculated on the server when the order is placed, so
        the total can never drift from our records.
      </p>

      {footer}
    </aside>
  );
}
