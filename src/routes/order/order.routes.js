const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order.controller');
const { registerRoute } = require('../register.routes');

router.post('/create', orderController.createOrderFromSelectedProducts);
router.get('/all', orderController.getAllOrders);
router.get('/:orderId', orderController.getOrderById);

registerRoute('/orders', router);

module.exports = router;
