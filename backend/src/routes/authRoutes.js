import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { login } from '../controllers/authController.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in a few minutes.',
  },
});

router.post('/login', loginLimiter, login);

export default router;
