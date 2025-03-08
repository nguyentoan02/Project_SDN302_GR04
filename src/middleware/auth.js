const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import model User

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.flash('error', 'You need login to continue.');
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
    res.status(400).json({ error: 'Invalid token.', details: error.message });
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
