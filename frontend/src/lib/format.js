const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
};

export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export const stockLabel = (stock) => {
  if (stock <= 0) return { text: 'Out of stock', tone: 'danger' };
  if (stock <= 3) return { text: `Only ${stock} left`, tone: 'warning' };
  return { text: 'In stock', tone: 'success' };
};
