const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const isApiRequest = req.xhr || req.headers.accept?.includes('application/json');
  const currentPath = encodeURIComponent(req.originalUrl);

  if (!token) {
    // For API request
    if (isApiRequest) {
      return res.status(401).json({
        status: 'error',
        message: 'Please login to continue',
        redirect: `/api/auth?redirect=${currentPath}`
      });
    }
    // For page requests, redirect to login
    return res.redirect(`/api/auth?redirect=${currentPath}`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password').lean();

    // Check if user exists
    if (!user) {
      res.clearCookie('token');
      if (isApiRequest) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found',
          redirect: `/api/auth?redirect=${currentPath}`
        });
      }
      return res.redirect(`/api/auth?redirect=${currentPath}`);
    }

    // Check token expiration
    if (Date.now() >= decoded.exp * 1000) {
      res.clearCookie('token');
      if (isApiRequest) {
        return res.status(401).json({
          status: 'error',
          message: 'Session expired',
          redirect: `/api/auth?redirect=${currentPath}`
        });
      }
      return res.redirect(`/api/auth?message=session_expired&redirect=${currentPath}`);
    }

    req.user = user;
    res.locals.user = user;

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.clearCookie('token');

    if (isApiRequest) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed',
        redirect: `/api/auth?redirect=${currentPath}`
      });
    }
    return res.redirect(`/api/auth?redirect=${currentPath}`);
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
    console.log(error);
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
