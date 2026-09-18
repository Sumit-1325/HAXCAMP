import { ProductCard } from './ProductCard.jsx';
import { cn } from '../../lib/cn.js';

export function ProductGrid({ products, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
