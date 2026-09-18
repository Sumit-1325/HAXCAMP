import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

// Shared loading/error/data state for one API call. Keeps every page from
// re-implementing abort handling, stale-response guards and a retry action.
export const useApiResource = (fetcher, deps = [], { enabled = true } = {}) => {
  const [state, setState] = useState({ data: null, error: null, isLoading: enabled });
  const [reloadToken, setReloadToken] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, error: null, isLoading: false });
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    setState((previous) => ({ ...previous, isLoading: true, error: null }));

    fetcherRef.current(controller.signal)
      .then((data) => {
        if (!cancelled) setState({ data, error: null, isLoading: false });
      })
      .catch((error) => {
        if (cancelled || axios.isCancel(error)) return;
        setState({ data: null, error, isLoading: false });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...state, reload };
};
