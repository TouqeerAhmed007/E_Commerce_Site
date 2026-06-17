const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_if_any');

      // Extract user using any possible ID property naming convention
      const targetId = decoded._id || decoded.id || decoded.userId;

      if (!targetId) {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid token payload.' });
      }

      // Get user from the database and omit password field
      req.user = await User.findById(targetId).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists.' });
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token verification failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };