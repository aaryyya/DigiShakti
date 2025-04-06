import express from 'express';
import { check } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/product.controller';
import { verifyToken, isAdmin } from '../middleware/auth.middleware';
import { uploadImages } from '../middleware/upload.middleware';

const router = express.Router();

// @route   POST /api/products
// @desc    Create a product
// @access  Private
router.post(
  '/',
  verifyToken,
  uploadImages,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price is required and must be a positive number').isFloat({ min: 0 }),
    check('category', 'Category is required').not().isEmpty(),
    check('stock', 'Stock is required and must be a positive number').isInt({ min: 0 }),
  ],
  createProduct
);

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get a single product
// @access  Public
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Product owner or admin)
router.put(
  '/:id',
  verifyToken,
  uploadImages,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
    check('category', 'Category is required').optional().not().isEmpty(),
    check('stock', 'Stock must be a positive number').optional().isInt({ min: 0 }),
  ],
  updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Product owner or admin)
router.delete('/:id', verifyToken, deleteProduct);

// @route   POST /api/products/:id/reviews
// @desc    Create a product review
// @access  Private
router.post(
  '/:id/reviews',
  verifyToken,
  [
    check('rating', 'Rating is required and must be between 1 and 5').isFloat({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty(),
  ],
  createProductReview
);

export default router; 