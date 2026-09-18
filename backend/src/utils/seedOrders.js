import { reserveOrderNumbers } from '../models/Counter.js';
import { analyticsWindowStart } from './months.js';
import { round2 } from './query.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export const HISTORICAL_ORDER_COUNT = 85;
const MAX_LINES_PER_ORDER = 3;

const CUSTOMERS = [
  { name: 'Riya Sharma', email: 'riya.sharma@example.com', phone: '9876543210' },
  { name: 'Amit Verma', email: 'amit.verma@example.com', phone: '9823456710' },
  { name: 'Neha Iyer', email: 'neha.iyer@example.com', phone: '9765432180' },
  { name: 'Karan Mehta', email: 'karan.mehta@example.com', phone: '9911223344' },
  { name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9845567712' },
  { name: 'Rohit Deshmukh', email: 'rohit.deshmukh@example.com', phone: '9700112233' },
  { name: 'Sanya Kapoor', email: 'sanya.kapoor@example.com', phone: '9867789012' },
  { name: 'Vikram Rao', email: 'vikram.rao@example.com', phone: '9988776655' },
  { name: 'Ananya Bose', email: 'ananya.bose@example.com', phone: '9812345678' },
  { name: 'Farhan Qureshi', email: 'farhan.qureshi@example.com', phone: '9753124680' },
];

const ADDRESSES = [
  { line1: '12 Palm Road, Flat 4B', line2: 'Near Palm Beach Road', city: 'Navi Mumbai', state: 'Maharashtra', postalCode: '400705', country: 'India' },
  { line1: '48 Sunrise Apartments', line2: '', city: 'Pune', state: 'Maharashtra', postalCode: '411001', country: 'India' },
  { line1: '301 Lakeview Residency', line2: 'Behind Metro Station', city: 'Bengaluru', state: 'Karnataka', postalCode: '560034', country: 'India' },
  { line1: '7 Hauz Khas Village', line2: '', city: 'New Delhi', state: 'Delhi', postalCode: '110016', country: 'India' },
  { line1: '22 Marine Drive', line2: 'Opposite Aquarium', city: 'Mumbai', state: 'Maharashtra', postalCode: '400002', country: 'India' },
  { line1: '15 Banjara Hills, Road No. 3', line2: '', city: 'Hyderabad', state: 'Telangana', postalCode: '500034', country: 'India' },
  { line1: '9 Salt Lake Sector 2', line2: '', city: 'Kolkata', state: 'West Bengal', postalCode: '700091', country: 'India' },
  { line1: '64 Anna Nagar West', line2: '', city: 'Chennai', state: 'Tamil Nadu', postalCode: '600040', country: 'India' },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (list) => list[randomInt(0, list.length - 1)];

// Older orders have had time to progress through the workflow; only recent
// ones are still Pending. Repeating values inside `pick` weights them.
const statusForAge = (daysAgo) => {
  if (daysAgo > 60) return 'Delivered';
  if (daysAgo > 30) return pick(['Delivered', 'Delivered', 'Delivered', 'Shipped']);
  if (daysAgo > 10) return pick(['Delivered', 'Shipped', 'Shipped', 'Processing']);
  return pick(['Pending', 'Pending', 'Processing']);
};

const buildItems = (products) => {
  const target = Math.min(randomInt(1, MAX_LINES_PER_ORDER), products.length);
  const used = new Set();
  const items = [];

  for (let attempt = 0; attempt < target * 5 && items.length < target; attempt += 1) {
    const product = pick(products);
    const id = String(product._id);
    if (used.has(id)) continue;
    used.add(id);

    const qty = randomInt(1, 2);
    items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      qty,
      subtotal: round2(product.price * qty),
    });
  }

  return items;
};

// Historical orders hold the same item snapshots a live order would, so the
// dashboard aggregates them through exactly the same queries.
export const buildHistoricalOrders = async (products, count = HISTORICAL_ORDER_COUNT) => {
  const orderNumbers = await reserveOrderNumbers(count);
  const now = Date.now();

  // Generated inside the analytics window so every seeded order lands in a
  // month the dashboard actually charts.
  const windowStart = analyticsWindowStart().getTime();
  const windowMs = now - windowStart;

  const timestamps = Array.from(
    { length: count },
    () => windowStart + Math.random() * windowMs,
  ).sort((a, b) => a - b);

  return timestamps.map((timestamp, index) => {
    const items = buildItems(products);
    const createdAt = new Date(timestamp);

    return {
      orderNumber: orderNumbers[index],
      customer: { ...pick(CUSTOMERS) },
      shippingAddress: { ...pick(ADDRESSES) },
      items,
      totalAmount: round2(items.reduce((sum, item) => sum + item.subtotal, 0)),
      status: statusForAge((now - timestamp) / DAY_MS),
      paymentMethod: 'COD',
      createdAt,
      updatedAt: createdAt,
    };
  });
};
