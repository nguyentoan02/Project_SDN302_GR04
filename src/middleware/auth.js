const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  console.log({ token });

  if (!token) {
    // For page requests, redirect to login
    const currentUrl = encodeURIComponent(req.originalUrl);
    return res.redirect(`/api/auth?redirect=${currentUrl}`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) {
      res.clearCookie('token');
      throw new AuthenticationError('User not found');
    }

    console.log('auth', { user });

    // Check token expiration
    if (Date.now() >= decoded.exp * 1000) {
      res.clearCookie('token');
      return res.redirect('/api/auth?message=session_expired');
    }

    req.user = user;
    res.locals.user = user;

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.clearCookie('token');
    next();
  }
};

const authStoreLocalUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password').lean();

    if (user) {
      req.user = user;
      res.locals.user = user;
    }

    next();
  } catch (error) {
    // Just continue without setting user
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

module.exports = { authMiddleware, checkUserRole, authStoreLocalUser };
