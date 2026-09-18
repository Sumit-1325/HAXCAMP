import { useCallback } from 'react';

import { fetchAnalytics } from '../api/analytics.js';
import { fetchOrders } from '../api/orders.js';
import { useApiResource } from './useApiResource.js';

export const useAnalytics = () => {
  const fetcher = useCallback((signal) => fetchAnalytics(signal), []);
  return useApiResource(fetcher, []);
};

export const useAdminOrders = (params = {}) => {
  const { status = '', page = 1 } = params;

  const fetcher = useCallback(
    (signal) => fetchOrders({ status, page }, signal),
    [status, page],
  );

  return useApiResource(fetcher, [status, page]);
};
