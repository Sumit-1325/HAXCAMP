import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../ui/Button.jsx';
import { Select } from '../ui/Input.jsx';
import { CATEGORIES, DEFAULT_SORT, SORT_OPTIONS } from '../../lib/constants.js';
import { pluralize } from '../../lib/format.js';
import { useDebounce } from '../../hooks/useDebounce.js';

export function ProductFilters({
  search,
  category,
  sort,
  total,
  isLoading,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClear,
}) {
  const [term, setTerm] = useState(search);
  const debouncedTerm = useDebounce(term, 350);

  // Keep the input in step with the URL (back/forward navigation).
  useEffect(() => {
    setTerm(search);
  }, [search]);

  useEffect(() => {
    if (debouncedTerm === search) return;
    onSearchChange(debouncedTerm);
  }, [debouncedTerm, search, onSearchChange]);

  const isFiltered = Boolean(search || category) || sort !== DEFAULT_SORT;

  return (
    <div className="rounded-card border border-ink-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="listing-search" className="mb-1.5 block text-sm font-medium text-ink-800">
            Search
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400"
            />
            <input
              id="listing-search"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search by product name…"
              className="h-11 w-full rounded-xl border border-ink-200 bg-white pr-9 pl-9 text-sm text-ink-900 transition placeholder:text-ink-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15 focus:outline-none"
            />
            {term ? (
              <button
                type="button"
                onClick={() => setTerm('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:w-96">
          <Select
            label="Category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Select label="Sort by" value={sort} onChange={(event) => onSortChange(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-4">
        <p aria-live="polite" className="text-sm text-ink-500">
          {isLoading ? 'Loading products…' : pluralize(total ?? 0, 'product')}
        </p>

        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
