const KEY = 'nexora.lastOrder';

// The confirmation page must survive a refresh, so the last order is kept in
// sessionStorage — long enough to survive F5, short enough not to linger.
export const saveLastOrder = (order) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable — the order is still placed on the server */
  }
};

export const readLastOrder = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearLastOrder = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
};
