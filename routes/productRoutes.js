const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

router.get('/', getProducts);
router.get('/:id', getProduct);

// Shared validation rules for image and product data
const productValidationRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  // FIX: Added imageUrl to the validation list so express-validator allows it through
  body('imageUrl').optional().trim().isString().withMessage('Image URL must be a valid string')
];

router.post('/', protect, restrictTo('admin'), productValidationRules, createProduct);

// FIX: Added validation to PUT to ensure clean data parsing on edits
router.put('/:id', protect, restrictTo('admin'), productValidationRules, updateProduct);

router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;