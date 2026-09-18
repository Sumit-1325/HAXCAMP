import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'nexora.cart';
const MAX_QTY = 99;

const CartContext = createContext(null);

const maxAllowedFor = (stock) =>
  Number.isInteger(stock) && stock > 0 ? Math.min(stock, MAX_QTY) : MAX_QTY;

const clampQty = (qty, stock) => Math.max(1, Math.min(Math.round(qty) || 1, maxAllowedFor(stock)));

// Cart lines keep a snapshot of the product purely for display. The server
// re-prices every order from the database, so a stale price here can never
// change what is actually charged.
const toCartItem = (product, qty) => ({
  productId: product._id,
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category,
  stock: product.stock,
  qty: clampQty(qty, product.stock),
});

const readStoredItems = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.productId === 'string' &&
          Number.isFinite(Number(item.qty)) &&
          Number(item.qty) > 0,
      )
      .map((item) => ({ ...item, qty: clampQty(Number(item.qty), item.stock) }));
  } catch {
    return [];
  }
};

const reducer = (items, action) => {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action;
      const existing = items.find((item) => item.productId === product._id);

      if (!existing) {
        return [...items, toCartItem(product, qty)];
      }

      return items.map((item) =>
        item.productId === product._id
          ? toCartItem(product, item.qty + qty)
          : item,
      );
    }

    case 'setQty':
      return items.map((item) =>
        item.productId === action.productId
          ? { ...item, qty: clampQty(action.qty, item.stock) }
          : item,
      );

    case 'remove':
      return items.filter((item) => item.productId !== action.productId);

    case 'clear':
      return [];

    default:
      return items;
  }
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, readStoredItems);

  // A cart that empties on refresh looks broken, so it lives in localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode) — cart just won't persist */
    }
  }, [items]);

  const addItem = useCallback(
    (product, qty = 1) => {
      if (!product || product.stock <= 0) {
        return { ok: false, reason: 'out-of-stock' };
      }

      const inCart = items.find((item) => item.productId === product._id)?.qty ?? 0;
      if (inCart >= maxAllowedFor(product.stock)) {
        return { ok: false, reason: 'max-reached' };
      }

      dispatch({ type: 'add', product, qty });
      return { ok: true };
    },
    [items],
  );

  const setQty = useCallback((productId, qty) => dispatch({ type: 'setQty', productId, qty }), []);
  const removeItem = useCallback((productId) => dispatch({ type: 'remove', productId }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(() => {
    const itemCount = items.reduce((count, item) => count + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      setQty,
      removeItem,
      clearCart,
      getQty: (productId) => items.find((item) => item.productId === productId)?.qty ?? 0,
      has: (productId) => items.some((item) => item.productId === productId),
      toOrderItems: () => items.map((item) => ({ productId: item.productId, qty: item.qty })),
    };
  }, [items, addItem, setQty, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
};
