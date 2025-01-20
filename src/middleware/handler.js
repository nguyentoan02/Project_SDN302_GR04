const { METHODS } = require('../utils/constant');

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const globalAsyncHandler = (router) => {
  METHODS.forEach((method) => {
    const original = router[method].bind(router);
    console.log(original);
    router[method] = function (path, ...handlers) {
      console.log({ handlers });
      const wrappedHandlers = handlers.map((handler) =>
        typeof handler === 'function' ? asyncHandler(handler) : handler
      );
      return original(path, ...wrappedHandlers);
    };
  });

  return router;
};

module.exports = globalAsyncHandler;
