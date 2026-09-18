import { Router } from 'express';

import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(createOrder).get(protect, getOrders);

router.put('/:id/status', protect, updateOrderStatus);

export default router;
