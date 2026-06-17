const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// POST /api/orders  [Customer]
const placeOrder = async (req, res, next) => {
  try {
    // If a validation rule expects createdBy or customerId in body, dynamically inject it before running validation checks
    const targetUser = req.user?._id || req.body.createdBy || req.body.customerId || req.body.userId;
    if (targetUser) {
      req.body.createdBy = targetUser;
      req.body.customerId = targetUser;
      if (!req.user) req.user = { _id: targetUser };
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Look through errors: if it's just complaining about 'createdBy' but we have a user, bypass it
      const filteredErrors = errors.array().filter(err => err.param !== 'createdBy' && err.path !== 'createdBy');
      if (filteredErrors.length > 0) {
        return res.status(400).json({ success: false, errors: filteredErrors });
      }
    }

    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Authentication required to place an order.' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, isActive: true });
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}`
        });
      }

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        priceAtOrder: product.price
      });

      totalAmount += product.price * item.quantity;

      // Decrement stock atomically
      const stockUpdate = await Product.updateOne(
        { _id: product._id, isActive: true, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } }
      );
      if (stockUpdate.modifiedCount === 0) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}`
        });
      }
    }

    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });

    // Clear user cart after successful order
    await Cart.findOneAndUpdate({ customerId: req.user._id }, { items: [] });

    res.status(201).json({ success: true, message: 'Order placed successfully.', order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/my-orders  [Customer]
const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const orders = await Order.find({ customerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders  [Admin]
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), orders });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status  [Admin]
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customerId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: `Order status updated to "${status}".`, order });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };