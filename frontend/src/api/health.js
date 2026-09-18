import { request } from './client.js';

// Deliberately uses the client's long timeout: this call exists to wake a
// sleeping free-tier instance, so it must outlast the wake rather than fail
// halfway through it.
export const fetchHealth = (signal) => request({ url: '/api/health', method: 'GET', signal });
