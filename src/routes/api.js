const express = require('express');
const router = express.Router();
const globalAsyncHandler = require('../middleware/handler');
const { getRoutes } = require('./register.routes');

//import router
require('./cart/cart.routes');
require('./order/order.routes');
<<<<<<< HEAD
=======

>>>>>>> d69a438c58839d9bacdfb4acea68c4a04ad10973
// Apply global async handler to router
globalAsyncHandler(router);

// Register all routes from the registry
getRoutes()?.forEach(({ path, router: moduleRouter }) => {
  if (!path || typeof path !== 'string') {
    throw new Error(`Invalid route path: ${path}`);
  }

  if (!moduleRouter || !moduleRouter.stack) {
    throw new Error(`Invalid router for path: ${path}`);
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  console.log(normalizedPath, '\n');

  router.use(normalizedPath, moduleRouter);
});

module.exports = router;
