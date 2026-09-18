import { useEffect, useState } from 'react';

import { fetchHealth } from '../api/health.js';

const SLOW_THRESHOLD_MS = 2500;

// The API runs on a free Render instance that sleeps when idle. Pinging
// /api/health on load tells us whether the first real request will be slow,
// so the UI can say "waking up the server" instead of looking broken.
export const useServerHealth = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;

    const slowTimer = setTimeout(() => {
      if (!cancelled) {
        setStatus((current) => (current === 'checking' ? 'waking' : current));
      }
    }, SLOW_THRESHOLD_MS);

    fetchHealth()
      .then(() => {
        if (!cancelled) setStatus('awake');
      })
      .catch(() => {
        if (!cancelled) setStatus('unreachable');
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
    };
  }, []);

  return status;
};
