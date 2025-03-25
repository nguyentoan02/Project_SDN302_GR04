const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // flag req.user as null to differentiate between logged in and logged out users
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    req.user = null;
    next();
  }
};

const checkUserRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authMiddleware, checkUserRole };
