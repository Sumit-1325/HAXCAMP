import { request } from './client.js';

export const fetchProducts = (params = {}, signal) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  );
  return request({ url: '/api/products', method: 'GET', params: query, signal });
};

export const fetchProduct = (id, signal) =>
  request({ url: `/api/products/${id}`, method: 'GET', signal });

export const fetchRecommendations = (id, signal) =>
  request({ url: `/api/products/${id}/recommendations`, method: 'GET', signal });

export const createProduct = (payload) =>
  request({ url: '/api/products', method: 'POST', data: payload });

export const updateProduct = (id, payload) =>
  request({ url: `/api/products/${id}`, method: 'PUT', data: payload });

export const archiveProduct = (id) =>
  request({ url: `/api/products/${id}`, method: 'DELETE' });
