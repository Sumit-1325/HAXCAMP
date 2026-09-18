const KEY = 'nexora.recentlyViewed';
const LIMIT = 6;

// Only a display snapshot is kept, so a stale entry can never affect pricing
// or stock — those are always read fresh from the API.
const toSnapshot = (product) => ({
  _id: product._id,
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category,
  stock: product.stock,
});

export const readRecentlyViewed = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) => item && typeof item._id === 'string' && typeof item.name === 'string',
    );
  } catch {
    return [];
  }
};

export const recordRecentlyViewed = (product) => {
  if (!product?._id) return;

  try {
    const rest = readRecentlyViewed().filter((item) => item._id !== product._id);
    localStorage.setItem(KEY, JSON.stringify([toSnapshot(product), ...rest].slice(0, LIMIT)));
  } catch {
    /* storage unavailable — the rail simply stays empty */
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
};
