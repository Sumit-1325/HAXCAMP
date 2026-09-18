import { Sparkles } from 'lucide-react';

import { ProductGrid } from './ProductGrid.jsx';
import { ProductGridSkeleton } from '../ui/Skeleton.jsx';
import { formatPrice } from '../../lib/format.js';
import { useRecommendations } from '../../hooks/useProducts.js';

// Supplementary content: if it fails to load or there is nothing to suggest,
// the section disappears rather than showing an error the shopper can't act on.
export function ProductRecommendations({ productId, category }) {
  const { data, isLoading } = useRecommendations(productId);
  const items = data?.items ?? [];

  if (!isLoading && items.length === 0) return null;

  // The API falls back to the nearest-priced items in the category when the
  // band is too narrow, so only claim "same price range" when that is true.
  const inPriceRange = data?.basis?.inPriceRange ?? 0;
  const priceHint =
    inPriceRange > 0
      ? ` — priced near ${formatPrice(data.basis.priceMin)} to ${formatPrice(data.basis.priceMax)}`
      : '';

  return (
    <section className="mt-16 border-t border-ink-200 pt-10">
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden="true" className="h-4 w-4 text-accent-600" />
        <h2 className="text-xl font-semibold tracking-tight text-ink-950">You might also like</h2>
      </div>

      <p className="mt-1.5 text-sm text-ink-500">
        Other {category} options{priceHint}.
      </p>

      <div className="mt-6">
        {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={items} />}
      </div>
    </section>
  );
}
