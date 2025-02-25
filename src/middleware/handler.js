const { METHODS } = require('../utils/constant');

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

const globalAsyncHandler = (router) => {
  METHODS.forEach((method) => {
    const original = router[method].bind(router);

    router[method] = function (path, ...handlers) {
      console.log({
        method,
        path,
        handlers
      });
      // Handle middleware mounting (use case)
      if (method === 'use' && typeof path === 'function') {
        handlers.unshift(path);
        path = '/';
      }

      // Handle sub-router mounting
      if (method === 'use' && path.stack) {
        return original.call(this, path);
      }

      // Wrap handlers with asyncHandler
      const wrappedHandlers = handlers.map((handler) => {
        if (typeof handler === 'function') {
          return asyncHandler(handler);
        }
        return handler;
      });

      return original.call(this, path, ...wrappedHandlers);
    };
  });

  return router;
};

module.exports = globalAsyncHandler;
