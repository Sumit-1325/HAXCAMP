const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const parsePagination = (query, defaultLimit, maxLimit) => {
  const page = Math.max(toInt(query.page, 1), 1);
  const limit = Math.min(Math.max(toInt(query.limit, defaultLimit), 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

export const paginated = (items, total, page, limit) => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
