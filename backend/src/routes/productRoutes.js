import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getRecommendations,
  updateProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getProducts).post(protect, createProduct);

// Declared before /:id so the shape of the path is unambiguous.
router.get('/:id/recommendations', getRecommendations);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
