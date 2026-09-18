import { cn } from '../../lib/cn.js';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-ink-200/70', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-ink-200 bg-white">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
