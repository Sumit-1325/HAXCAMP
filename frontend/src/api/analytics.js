import { request } from './client.js';

export const fetchAnalytics = (signal) =>
  request({ url: '/api/admin/analytics', method: 'GET', signal });
