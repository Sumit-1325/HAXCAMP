export const ANALYTICS_MONTHS = 6;

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Months are bucketed in UTC and labelled from a fixed table so the series
// never shifts with the server's locale or timezone.
export const monthKey = (year, month) => `${year}-${String(month).padStart(2, '0')}`;

export const buildMonthRange = (monthsBack = ANALYTICS_MONTHS) => {
  const now = new Date();
  const range = [];

  for (let offset = monthsBack - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;

    range.push({
      month: monthKey(year, month),
      label: `${MONTH_LABELS[month - 1]} ${year}`,
    });
  }

  return range;
};

// First instant of the earliest month in the analytics range. Seeded history is
// generated from here so the by-month series always reconciles with the
// headline totals instead of silently dropping orders that fall before the
// first bucket.
export const analyticsWindowStart = (monthsBack = ANALYTICS_MONTHS) => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (monthsBack - 1), 1));
};
