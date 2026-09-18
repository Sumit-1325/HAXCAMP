import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { QuantityStepper } from '../ui/QuantityStepper.jsx';
import { ProductImage } from '../product/ProductImage.jsx';
import { formatPrice } from '../../lib/format.js';

export function CartLineItem({ item, onQuantityChange, onRemove }) {
  const lineTotal = item.price * item.qty;

  return (
    <li className="flex gap-4 py-5">
      <Link
        to={`/products/${item.productId}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-ink-100 sm:h-28 sm:w-28"
      >
        <ProductImage product={item} className="h-full w-full" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-medium tracking-wider text-ink-400 uppercase">
              {item.category}
            </span>
            <h2 className="mt-1 truncate text-sm font-semibold text-ink-900">
              <Link to={`/products/${item.productId}`} className="transition hover:text-accent-700">
                {item.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-ink-500">{formatPrice(item.price)} each</p>
          </div>

          <p className="shrink-0 text-sm font-semibold text-ink-950 tabular-nums">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <QuantityStepper
            value={item.qty}
            onChange={(value) => onQuantityChange(item.productId, value)}
            max={Math.max(item.stock, 1)}
          />

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-ink-500 transition hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Remove
          </button>
        </div>

        {item.qty >= item.stock ? (
          <p className="mt-2 text-sm text-amber-700">
            Only {item.stock} in stock — that is the maximum for this item.
          </p>
        ) : null}
      </div>
    </li>
  );
}
