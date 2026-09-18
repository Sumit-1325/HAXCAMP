import { request } from './client.js';

export const createOrder = (payload) =>
  request({ url: '/api/orders', method: 'POST', data: payload });

export const fetchOrders = (params = {}, signal) =>
  request({ url: '/api/orders', method: 'GET', params, signal });

export const updateOrderStatus = (id, status) =>
  request({ url: `/api/orders/${id}/status`, method: 'PUT', data: { status } });
