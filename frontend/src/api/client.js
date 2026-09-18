import axios from 'axios';

import { clearSession, getToken } from '../lib/authStorage.js';

export const UNAUTHORIZED_EVENT = 'nexora:unauthorized';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const toApiError = (error) => {
  if (error instanceof ApiError) return error;

  if (error.code === 'ECONNABORTED') {
    return new ApiError(
      'The server took too long to respond. It may be waking up — please try again.',
      408,
    );
  }

  if (!error.response) {
    return new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }

  const { status, data } = error.response;
  return new ApiError(data?.message || `Request failed with status ${status}`, status);
};

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the token expired or was revoked: drop the session and let the
// auth layer react. Reacting via an event keeps this module free of router
// and React dependencies.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aborted requests are a normal part of unmounting; let callers detect them.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      clearSession();
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(toApiError(error));
  },
);

export const request = async (config) => {
  const { data } = await apiClient.request(config);
  return data?.data;
};
