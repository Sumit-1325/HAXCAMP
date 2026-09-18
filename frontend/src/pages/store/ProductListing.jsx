import { PackageSearch } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { ProductGridSkeleton } from '../../components/ui/Skeleton.jsx';
import { ProductFilters } from '../../components/product/ProductFilters.jsx';
import { ProductGrid } from '../../components/product/ProductGrid.jsx';
import { DEFAULT_SORT } from '../../lib/constants.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useProducts } from '../../hooks/useProducts.js';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? DEFAULT_SORT;
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);

  const { data, error, isLoading, reload } = useProducts({ search, category, sort, page });

  useDocumentTitle(
    search ? `Search: ${search}` : category ? `${category}` : 'All products',
  );

  // The URL is the single source of truth for filters, so the listing is
  // shareable, bookmarkable and survives a refresh.
  const setParams = useCallback(
    (changes) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === '' || value === null || value === undefined) next.delete(key);
          else next.set(key, String(value));
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const changeSearch = useCallback((value) => setParams({ search: value, page: null }), [setParams]);
  const changeCategory = useCallback((value) => setParams({ category: value, page: null }), [setParams]);
  const changeSort = useCallback((value) => setParams({ sort: value, page: null }), [setParams]);
  const clearFilters = useCallback(
    () => setParams({ search: '', category: '', sort: '', page: null }),
    [setParams],
  );
  const changePage = useCallback((value) => setParams({ page: value }), [setParams]);

  // Filter changes reset to page 1; only a real page change scrolls the grid
  // back into view.
  const resultsRef = useRef(null);
  const previousPage = useRef(page);

  useEffect(() => {
    if (previousPage.current !== page) {
      previousPage.current = page;
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page]);

  const products = data?.items ?? [];
  const heading = category || 'All products';

  return (
    <Container className="py-10">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950">
          {search ? `Results for “${search}”` : heading}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {search
            ? 'Products matching your search across the NEXORA collection.'
            : 'Audio, input, display and desk essentials chosen for long working days.'}
        </p>
      </header>

      <div className="mt-8">
        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          total={data?.total ?? 0}
          isLoading={isLoading}
          onSearchChange={changeSearch}
          onCategoryChange={changeCategory}
          onSortChange={changeSort}
          onClear={clearFilters}
        />
      </div>

      <div ref={resultsRef} className="scroll-mt-24 pt-8">
        {isLoading ? <ProductGridSkeleton count={8} /> : null}

        {!isLoading && error ? (
          <ErrorState
            title="We couldn't load the products"
            message={error.message}
            onRetry={reload}
          />
        ) : null}

        {!isLoading && !error && products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title={search ? `No products match “${search}”` : 'Nothing here yet'}
            description={
              search
                ? 'Try a different search term, or browse the full collection.'
                : 'There are no products in this category right now.'
            }
            action={<Button onClick={clearFilters}>Clear filters</Button>}
          />
        ) : null}

        {!isLoading && !error && products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <Pagination
              className="mt-10"
              page={data.page}
              totalPages={data.totalPages}
              onChange={changePage}
            />
          </>
        ) : null}
      </div>
    </Container>
  );
}
