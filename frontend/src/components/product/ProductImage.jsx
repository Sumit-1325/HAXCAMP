import { ImageOff } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../../lib/cn.js';

// Seeded and admin-entered products may have a broken or missing image URL,
// so every product visual goes through here and degrades to a neutral tile.
export function ProductImage({ product, className, loading = 'lazy' }) {
  const [hasFailed, setHasFailed] = useState(false);

  if (!product?.image || hasFailed) {
    return (
      <div className={cn('grid place-items-center bg-ink-100 text-ink-300', className)}>
        <ImageOff aria-hidden="true" className="h-8 w-8" />
        <span className="sr-only">No image available for {product?.name}</span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      loading={loading}
      onError={() => setHasFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}
