// Must stay in sync with backend/src/constants/index.js

export const CATEGORIES = [
  'Audio',
  'Keyboards',
  'Mice',
  'Monitors',
  'Webcams',
  'Lighting',
  'Accessories',
];

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export const ORDER_STATUS_TONES = {
  Pending: 'warning',
  Processing: 'accent',
  Shipped: 'accent',
  Delivered: 'success',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

export const DEFAULT_SORT = 'newest';

export const PRODUCT_PAGE_SIZE = 12;

export const LOW_STOCK_THRESHOLD = 5;
