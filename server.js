require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit'); // disabled
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // <-- NEW: Imported Category Routes

const User = require('./models/User'); 

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting - disabled for smooth browsing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { success: false, message: 'Too many requests. Please try again later.' }
// });
// app.use('/api/', limiter);

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
// });
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes); // <-- NEW: Connected Category Routes to the API

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running.', env: process.env.NODE_ENV });
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// FIXED FOR EXPRESS v5: Standard middleware catch-all that avoids the strict path-to-regexp parser.
// It explicitly lets API requests and static assets bypass it, sending all other direct page requests to index.html.
app.use((req, res, next) => {
  // If it's an API call or looks like a static asset file request, don't touch it!
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  // --- Auto-seed the Admin on startup ---
  try {
    const adminExists = await User.findOne({ email: 'admin@octaloop.com' });
    if (!adminExists) {
      await User.create({
        name: 'OctaloopAdmin',
        email: 'admin@octaloop.com',
        password: 'octaloop',
        role: 'admin'
      });
      console.log('[OK] Default Admin automatically created!');
    }
  } catch (error) {
    console.error('[WARN] Could not automatically seed admin user:', error.message);
  }
  // --------------------------------------

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

start();

module.exports = app;