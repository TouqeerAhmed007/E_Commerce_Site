const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Customer
router.post('/', protect, restrictTo('customer'), [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required')
], placeOrder);

router.get('/my-orders', protect, restrictTo('customer'), getMyOrders);

// Admin
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.put('/:id/status', protect, restrictTo('admin'), [
  body('status').notEmpty().withMessage('Status is required')
], updateOrderStatus);

module.exports = router;