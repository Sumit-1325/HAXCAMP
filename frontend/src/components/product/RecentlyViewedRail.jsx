import { History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProductImage } from './ProductImage.jsx';
import { formatPrice } from '../../lib/format.js';
import { readRecentlyViewed } from '../../lib/recentlyViewed.js';

export function RecentlyViewedRail({ excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readRecentlyViewed().filter((item) => item._id !== excludeId));
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-ink-200 pt-10">
      <div className="flex items-center gap-2">
        <History aria-hidden="true" className="h-4 w-4 text-ink-400" />
        <h2 className="text-xl font-semibold tracking-tight text-ink-950">Recently viewed</h2>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <li key={item._id}>
            <Link to={`/products/${item._id}`} className="group block">
              <div className="overflow-hidden rounded-xl border border-ink-200 bg-ink-100">
                <ProductImage
                  product={item}
                  className="aspect-4/3 w-full transition duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-ink-900 transition group-hover:text-accent-700">
                {item.name}
              </p>
              <p className="mt-0.5 text-sm text-ink-500">{formatPrice(item.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
