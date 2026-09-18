import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from './errorMiddleware.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  const token = header.slice(7).trim();

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized('Not authorized, token is invalid or expired');
  }

  const admin = await Admin.findById(payload.id);
  if (!admin) {
    throw ApiError.unauthorized('Not authorized, account no longer exists');
  }

  req.admin = admin;
  next();
});
