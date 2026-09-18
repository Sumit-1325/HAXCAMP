import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants/index.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { escapeRegex, paginated, parsePagination } from '../utils/query.js';

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  'name-asc': { name: 1 },
  'name-desc': { name: -1 },
};

const EDITABLE_FIELDS = ['name', 'description', 'price', 'category', 'image', 'stock', 'isActive'];

const pickEditableFields = (body) => {
  const payload = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (body[field] !== undefined) payload[field] = body[field];
  });
  return payload;
};

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const filter = { isActive: true };

  const search = String(req.query.search || '').trim();
  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: 'i' };
  }

  const category = String(req.query.category || '').trim();
  if (category) {
    filter.category = category;
  }

  const sort = SORT_OPTIONS[req.query.sort] ? req.query.sort : 'newest';

  const [items, total] = await Promise.all([
    Product.find(filter).sort(SORT_OPTIONS[sort]).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, data: paginated(items, total, page, limit) });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) {
    throw ApiError.notFound('Product not found');
  }
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickEditableFields(req.body));
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const payload = pickEditableFields(req.body);
  if (Object.keys(payload).length === 0) {
    throw ApiError.badRequest('No valid product fields provided to update');
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: 'after' },
  );

  if (!product) {
    throw ApiError.notFound('Product not found');
  }
  res.json({ success: true, data: product, message: 'Product archived' });
});
