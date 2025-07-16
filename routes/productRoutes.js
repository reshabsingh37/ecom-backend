import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authMiddleware, authorizeRoles('admin'), createProduct);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateProduct);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteProduct);

export default router;
