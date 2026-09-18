import { env } from '../config/env.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { buildMonthRange, monthKey } from '../utils/months.js';
import { round2 } from '../utils/query.js';

const TOP_PRODUCT_LIMIT = 5;

export const getAnalytics = asyncHandler(async (req, res) => {
  const [totals, revenueByMonthRaw, salesByCategoryRaw, topProductsRaw, lowStockCount] =
    await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 },
          },
        },
      ]),

      Order.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 },
          },
        },
      ]),

      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.category',
            revenue: { $sum: '$items.subtotal' },
            units: { $sum: '$items.qty' },
          },
        },
        { $sort: { revenue: -1 } },
      ]),

      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            name: { $last: '$items.name' },
            category: { $last: '$items.category' },
            revenue: { $sum: '$items.subtotal' },
            units: { $sum: '$items.qty' },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: TOP_PRODUCT_LIMIT },
      ]),

      Product.countDocuments({ isActive: true, stock: { $lte: env.lowStockThreshold } }),
    ]);

  const totalRevenue = round2(totals[0]?.revenue ?? 0);
  const totalOrders = totals[0]?.orders ?? 0;

  const revenueByMonthMap = new Map(
    revenueByMonthRaw.map((row) => [
      monthKey(row._id.year, row._id.month),
      { revenue: row.revenue, orders: row.orders },
    ]),
  );

  // Months with no orders are returned as zero so the chart stays continuous
  // instead of collapsing gaps.
  const revenueByMonth = buildMonthRange().map(({ month, label }) => {
    const match = revenueByMonthMap.get(month);
    return {
      month,
      label,
      revenue: round2(match?.revenue ?? 0),
      orders: match?.orders ?? 0,
    };
  });

  const salesByCategory = salesByCategoryRaw.map((row) => ({
    category: row._id,
    revenue: round2(row.revenue),
    units: row.units,
  }));

  const topProducts = topProductsRaw.map((row) => ({
    productId: row._id,
    name: row.name,
    category: row.category,
    revenue: round2(row.revenue),
    units: row.units,
  }));

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders === 0 ? 0 : round2(totalRevenue / totalOrders),
      lowStockCount,
      lowStockThreshold: env.lowStockThreshold,
      revenueByMonth,
      salesByCategory,
      topProducts,
    },
  });
});
