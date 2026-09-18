import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/Button.jsx';
import { ProductImage } from './ProductImage.jsx';
import { StockBadge } from '../ui/StockBadge.jsx';
import { formatPrice } from '../../lib/format.js';
import { useAddToCart } from '../../hooks/useAddToCart.js';

export function ProductCard({ product }) {
  const addToCart = useAddToCart();
  const isOutOfStock = product.stock <= 0;
  const detailsPath = `/products/${product._id}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-ink-200 bg-white transition hover:border-ink-300 hover:shadow-lg hover:shadow-ink-950/5">
      <Link to={detailsPath} className="overflow-hidden bg-ink-100" tabIndex={-1} aria-hidden="true">
        <ProductImage
          product={product}
          className="aspect-4/3 w-full transition duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-wider text-ink-400 uppercase">
            {product.category}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <h3 className="mt-2.5 text-sm font-semibold text-ink-900">
          <Link to={detailsPath} className="transition hover:text-accent-700">
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-500">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-base font-semibold text-ink-950">{formatPrice(product.price)}</span>

          <Button
            size="sm"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
            {isOutOfStock ? 'Sold out' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  );
}
