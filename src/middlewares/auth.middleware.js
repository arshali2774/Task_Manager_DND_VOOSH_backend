const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware for protecting routes
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      // If no user found, return unauthorized response
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
      }
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed',
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

module.exports = { protect };
