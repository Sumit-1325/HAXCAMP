import { request } from './client.js';

export const login = (credentials) =>
  request({ url: '/api/auth/login', method: 'POST', data: credentials });
