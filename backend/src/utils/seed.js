import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { resetOrderCounter } from '../models/Counter.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { SEED_PRODUCTS } from './seedData.js';
import { buildHistoricalOrders } from './seedOrders.js';

const resetDatabase = async () => {
  await Promise.all([
    Product.deleteMany({}),
    Admin.deleteMany({}),
    Order.deleteMany({}),
  ]);
  await resetOrderCounter();
};

const seedProducts = () => Product.insertMany(SEED_PRODUCTS);

const seedAdmins = async () => {
  const admins = [];
  for (const admin of env.seedAdmins) {
    admins.push(await Admin.create(admin));
  }
  return admins;
};

const seedOrders = async (products) => {
  const orders = await buildHistoricalOrders(products);

  // timestamps: false keeps the explicit createdAt we generated, so the
  // analytics range genuinely spans the last six months.
  await Order.insertMany(orders, { timestamps: false });

  return orders.length;
};

const run = async () => {
  await connectDB();
  console.log('[seed] clearing existing data...');
  await resetDatabase();

  const products = await seedProducts();
  console.log(`[seed] inserted ${products.length} products`);

  const admins = await seedAdmins();
  admins.forEach((admin) => console.log(`[seed] admin ready: ${admin.email} (${admin.role})`));

  const orderCount = await seedOrders(products);
  console.log(`[seed] inserted ${orderCount} historical orders over the last 6 months`);

  await disconnectDB();
  console.log('[seed] done');
};

run().catch(async (error) => {
  console.error(`[seed] failed: ${error.message}`);
  await disconnectDB();
  process.exit(1);
});
