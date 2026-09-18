import dotenv from 'dotenv';

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toList = (value, fallback) => {
  if (!value) return fallback;
  const list = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : fallback;
};

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];
const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`[env] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[env] Copy backend/.env.example to backend/.env and fill in the values.');
  process.exit(1);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: toInt(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigins: toList(process.env.CORS_ORIGINS, ['http://localhost:5173']),
  lowStockThreshold: toInt(process.env.LOW_STOCK_THRESHOLD, 5),
  seedAdmins: [
    {
      name: process.env.ADMIN_NAME || 'NEXORA Admin',
      email: process.env.ADMIN_EMAIL || 'admin@nexora.dev',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
    },
    {
      name: process.env.DEMO_ADMIN_NAME || 'Demo Admin',
      email: process.env.DEMO_ADMIN_EMAIL || 'demo@nexora.dev',
      password: process.env.DEMO_ADMIN_PASSWORD || 'Demo@12345',
      role: 'demo',
    },
  ],
};
