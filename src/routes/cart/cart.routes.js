const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

const { registerRoute } = require('../register.routes');
const globalAsyncHandler = require('../../middleware/handler');
const { authMiddleware } = require('../../middleware/auth');

globalAsyncHandler(router);

router.use(authMiddleware);

router.get('/products', cartController.getCart);
router.post('/new', cartController.addToCart);
router.put('/update', cartController.updateAmount);
router.delete('/remove', cartController.removeItem);

registerRoute('/cart', router);

module.exports = router;
