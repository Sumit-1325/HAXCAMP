import { ORDER_STATUSES } from '../constants/index.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { nextOrderNumber } from '../models/Counter.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { paginated, parsePagination, round2 } from '../utils/query.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw ApiError.badRequest('Order must contain at least one item');
  }

  const seen = new Set();
  return items.map((item) => {
    const productId = String(item?.productId || '').trim();
    const qty = Number(item?.qty);

    if (!productId) {
      throw ApiError.badRequest('Each order item requires a productId');
    }
    if (!Number.isInteger(qty) || qty < 1) {
      throw ApiError.badRequest('Each order item requires a whole number qty of at least 1');
    }
    if (seen.has(productId)) {
      throw ApiError.badRequest('The same product cannot appear twice in one order');
    }

    seen.add(productId);
    return { productId, qty };
  });
};

const restoreStock = async (decremented) => {
  if (decremented.length === 0) return;

  await Product.bulkWrite(
    decremented.map((line) => ({
      updateOne: {
        filter: { _id: line.productId },
        update: { $inc: { stock: line.qty } },
      },
    })),
  );
};

export const createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, paymentMethod } = req.body;
  const lines = normalizeItems(req.body.items);

  const products = await Product.find({ _id: { $in: lines.map((line) => line.productId) } });
  const productById = new Map(products.map((product) => [String(product._id), product]));

  const orderItems = lines.map((line) => {
    const product = productById.get(line.productId);
    if (!product || !product.isActive) {
      throw ApiError.notFound(`Product is not available: ${line.productId}`);
    }

    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      qty: line.qty,
      subtotal: round2(product.price * line.qty),
    };
  });

  const totalAmount = round2(orderItems.reduce((sum, item) => sum + item.subtotal, 0));

  const decremented = [];
  try {
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, isActive: true, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { returnDocument: 'after' },
      );

      if (!updated) {
        throw ApiError.conflict(`Insufficient stock for "${item.name}"`);
      }

      decremented.push({ productId: item.productId, qty: item.qty });
    }

    const order = await Order.create({
      orderNumber: await nextOrderNumber(),
      customer,
      shippingAddress,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    await restoreStock(decremented);
    throw error;
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, DEFAULT_LIMIT, MAX_LIMIT);
  const filter = {};

  const status = String(req.query.status || '').trim();
  if (status) {
    if (!ORDER_STATUSES.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${ORDER_STATUSES.join(', ')}`);
    }
    filter.status = status;
  }

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: paginated(items, total, page, limit) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    throw ApiError.badRequest(`Status must be one of: ${ORDER_STATUSES.join(', ')}`);
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  res.json({ success: true, data: order });
});
