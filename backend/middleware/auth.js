var jwt = require('jsonwebtoken');
var User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please login to continue.'
      });
    }

    // Verify token with proper error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'arthive_secret_key');
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
          code: 'TOKEN_EXPIRED'
        });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.',
          code: 'TOKEN_INVALID'
        });
      }
      throw jwtError;
    }
    
    // Get user from database (excluding sensitive fields)
    const user = await User.findById(decoded.userId).select('-resetOTP -resetToken -resetOTPExpiry');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.',
        code: 'ACCOUNT_BLOCKED'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Middleware to check user roles
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token (for browse/explore only)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arthive_secret_key');
        const user = await User.findById(decoded.userId).select('-resetOTP -resetToken -resetOTPExpiry');
        
        if (user && !user.isBlocked) {
          req.user = user;
          req.userId = user._id;
        }
      } catch (jwtError) {
        // Silently fail for optional auth - just continue without user
        console.debug('Optional auth failed:', jwtError.message);
      }
    }
    
    next();
  } catch (error) {
    // If any error occurs, just continue without user
    console.debug('Optional auth error:', error.message);
    next();
  }
};

module.exports = authenticateToken;
module.exports.authenticateToken = authenticateToken;
module.exports.authorizeRole = authorizeRole;
module.exports.optionalAuth = optionalAuth;