const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user._id })
      .populate('items.productId', 'name price imageUrl stockQuantity isActive');
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) {
    next(err);
  }
};

// POST /api/cart  (add item)
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

    let cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      cart = await Cart.create({ customerId: req.user._id, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }

    await cart.populate('items.productId', 'name price imageUrl');
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/:productId  (update quantity)
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not in cart.' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true, message: 'Item removed from cart.', cart });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };