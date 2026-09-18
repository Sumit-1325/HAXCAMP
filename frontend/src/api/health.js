import { request } from './client.js';

// The API is on a free Render instance that sleeps when idle, so the first
// request can take a while. This call is given a generous timeout because its
// whole job is to wake the server up.
export const fetchHealth = (signal) =>
  request({ url: '/api/health', method: 'GET', timeout: 60000, signal });
