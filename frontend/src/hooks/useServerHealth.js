import { useEffect, useState } from 'react';

import { fetchHealth } from '../api/health.js';

const SLOW_THRESHOLD_MS = 2500;
const RETRY_DELAY_MS = 5000;
const MAX_ATTEMPTS = 6;

// The API runs on a free Render instance that sleeps when idle. Pinging
// /api/health on load tells us whether the first real request will be slow, so
// the UI can say "waking up the server" instead of looking broken.
//
// The check keeps retrying while the server is silent rather than latching on
// the first failure: a cold start resolves on its own, and a banner still
// claiming "cannot reach the server" after the data has clearly loaded is worse
// than no banner at all.
export const useServerHealth = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    let slowTimer;
    let retryTimer;
    let attempt = 0;

    const ping = () => {
      slowTimer = setTimeout(() => {
        if (!cancelled) setStatus((current) => (current === 'checking' ? 'waking' : current));
      }, SLOW_THRESHOLD_MS);

      fetchHealth()
        .then(() => {
          if (!cancelled) setStatus('awake');
        })
        .catch(() => {
          if (cancelled) return;

          attempt += 1;
          if (attempt >= MAX_ATTEMPTS) {
            setStatus('unreachable');
            return;
          }

          // Still hopeful: the server is probably mid cold start.
          setStatus('waking');
          retryTimer = setTimeout(ping, RETRY_DELAY_MS);
        })
        .finally(() => clearTimeout(slowTimer));
    };

    ping();

    return () => {
      cancelled = true;
      clearTimeout(slowTimer);
      clearTimeout(retryTimer);
    };
  }, []);

  return status;
};
