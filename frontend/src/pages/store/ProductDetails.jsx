import { ArrowLeft, BadgeIndianRupee, PackageX, ShoppingBag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Breadcrumb } from '../../components/ui/Breadcrumb.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { QuantityStepper } from '../../components/ui/QuantityStepper.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { StockBadge } from '../../components/ui/StockBadge.jsx';
import { ProductImage } from '../../components/product/ProductImage.jsx';
import { ProductRecommendations } from '../../components/product/ProductRecommendations.jsx';
import { RecentlyViewedRail } from '../../components/product/RecentlyViewedRail.jsx';
import { formatPrice } from '../../lib/format.js';
import { recordRecentlyViewed } from '../../lib/recentlyViewed.js';
import { useAddToCart } from '../../hooks/useAddToCart.js';
import { useCart } from '../../context/CartContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useProduct } from '../../hooks/useProducts.js';

const NOT_FOUND_STATUSES = [400, 404];

function DetailsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <Skeleton className="aspect-4/3 w-full rounded-card" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-48" />
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, error, isLoading, reload } = useProduct(id);
  const addToCart = useAddToCart();
  const { getQty, itemCount } = useCart();
  const [quantity, setQuantity] = useState(1);

  useDocumentTitle(product?.name ?? 'Product');

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  // Feeds the "Recently viewed" rail on the next product page.
  useEffect(() => {
    if (product) recordRecentlyViewed(product);
  }, [product]);

  if (isLoading) {
    return (
      <Container className="py-10">
        <DetailsSkeleton />
      </Container>
    );
  }

  if (error && NOT_FOUND_STATUSES.includes(error.status)) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={PackageX}
          title="This product is no longer available"
          description="It may have been removed from the store, or the link could be out of date."
          action={<Button to="/products">Browse the collection</Button>}
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState
          title="We couldn't load this product"
          message={error.message}
          onRetry={reload}
        />
      </Container>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inCart = getQty(product._id);

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: product.category, to: `/products?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />

      <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-card border border-ink-200 bg-ink-100">
          <ProductImage product={product} loading="eager" className="aspect-4/3 w-full" />
        </div>

        <div>
          <span className="text-xs font-medium tracking-wider text-ink-400 uppercase">
            {product.category}
          </span>

          <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-ink-950">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-ink-950">{formatPrice(product.price)}</span>
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-6 text-base leading-7 text-ink-600">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              max={Math.max(product.stock, 1)}
              disabled={isOutOfStock}
            />

            <Button
              size="lg"
              disabled={isOutOfStock}
              onClick={() => addToCart(product, quantity)}
              className="flex-1 sm:flex-none"
            >
              <ShoppingBag aria-hidden="true" className="h-4 w-4" />
              {isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>

          {isOutOfStock ? (
            <p className="mt-3 text-sm text-ink-500">
              This item is currently unavailable. Check back soon.
            </p>
          ) : inCart > 0 ? (
            <p className="mt-3 text-sm text-ink-500">
              {inCart} already in your cart ·{' '}
              <Link to="/cart" className="font-medium text-accent-700 hover:text-accent-800">
                View cart
              </Link>
            </p>
          ) : null}

          <dl className="mt-10 space-y-4 border-t border-ink-200 pt-6">
            <div className="flex items-start gap-3">
              <BadgeIndianRupee aria-hidden="true" className="mt-0.5 h-5 w-5 text-ink-400" />
              <div>
                <dt className="text-sm font-medium text-ink-900">Cash on delivery</dt>
                <dd className="text-sm text-ink-500">Pay when your order arrives.</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck aria-hidden="true" className="mt-0.5 h-5 w-5 text-ink-400" />
              <div>
                <dt className="text-sm font-medium text-ink-900">Dispatch in 1–2 days</dt>
                <dd className="text-sm text-ink-500">Delivered across India, no account needed.</dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/products" variant="ghost" size="sm">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Continue shopping
            </Button>

            {itemCount > 0 ? (
              <Link to="/cart" className="text-sm font-medium text-accent-700 hover:text-accent-800">
                Go to cart ({itemCount})
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <ProductRecommendations productId={product._id} category={product.category} />
      <RecentlyViewedRail excludeId={product._id} />
    </Container>
  );
}
