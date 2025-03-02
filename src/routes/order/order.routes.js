const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order.controller');
const { registerRoute } = require('../register.routes');
const globalAsyncHandler = require('../../middleware/handler');

globalAsyncHandler(router);

router.get('/orders/all', orderController.getAllOrders);
router.post('/create', orderController.createOrderFromSelectedProducts);
router.get('/:orderId', orderController.getOrderById);

registerRoute('/orders', router);

module.exports = router;
