const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const normalizeImageUrl = require('../utils/normalizeImageUrl');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products
// ─────────────────────────────────────────────────────────────────────────────
const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('createdBy', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products/:id
// ─────────────────────────────────────────────────────────────────────────────
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('createdBy', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/products [Admin]
// ─────────────────────────────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Explicitly pull fields from req.body
    const { name, description, price, category, stockQuantity, imageUrl } = req.body;
    
    const product = await Product.create({
      name, 
      description: description || '', 
      price, 
      category,
      stockQuantity: stockQuantity || 0,
      imageUrl: normalizeImageUrl(imageUrl || req.body.imageURL || req.body.image || req.body.img || ''),
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Product created.', product });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/products/:id [Admin]
// ─────────────────────────────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    // FIX: Added the missing express-validator validation check for product updates
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Explicitly capture all update attributes including imageUrl and isActive
    const { name, description, price, category, stockQuantity, imageUrl, isActive } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        price, 
        category, 
        stockQuantity, 
        imageUrl: normalizeImageUrl(imageUrl || req.body.imageURL || req.body.image || req.body.img || ''),
        isActive 
      },
      { new: true, runValidators: true } // 'new: true' returns the updated document back to the UI
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product updated.', product });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/products/:id [Admin] - soft delete
// ─────────────────────────────────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product removed.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };