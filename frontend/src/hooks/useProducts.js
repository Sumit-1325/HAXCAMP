import { useCallback } from 'react';

import { fetchProduct, fetchProducts, fetchRecommendations } from '../api/products.js';
import { useApiResource } from './useApiResource.js';

export const useProducts = (params = {}) => {
  const { search = '', category = '', sort = '', page = 1, limit } = params;

  const fetcher = useCallback(
    (signal) => fetchProducts({ search, category, sort, page, limit }, signal),
    [search, category, sort, page, limit],
  );

  return useApiResource(fetcher, [search, category, sort, page, limit]);
};

export const useProduct = (id) => {
  const fetcher = useCallback((signal) => fetchProduct(id, signal), [id]);
  return useApiResource(fetcher, [id], { enabled: Boolean(id) });
};

export const useRecommendations = (id) => {
  const fetcher = useCallback((signal) => fetchRecommendations(id, signal), [id]);
  return useApiResource(fetcher, [id], { enabled: Boolean(id) });
};
