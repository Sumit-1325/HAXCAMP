import { useCallback } from 'react';

import { fetchProduct, fetchProducts } from '../api/products.js';
import { useApiResource } from './useApiResource.js';

export const useProducts = (params = {}) => {
  const { search = '', category = '', sort = '', page = 1 } = params;

  const fetcher = useCallback(
    (signal) => fetchProducts({ search, category, sort, page }, signal),
    [search, category, sort, page],
  );

  return useApiResource(fetcher, [search, category, sort, page]);
};

export const useProduct = (id) => {
  const fetcher = useCallback((signal) => fetchProduct(id, signal), [id]);
  return useApiResource(fetcher, [id], { enabled: Boolean(id) });
};
