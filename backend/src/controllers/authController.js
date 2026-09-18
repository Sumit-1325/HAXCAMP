import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.matchPassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.json({ success: true, data: { token, admin: admin.toJSON() } });
});
