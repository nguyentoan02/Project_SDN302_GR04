const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.get('/products', cartController.getCart);
router.post('/new', cartController.addToCart);
router.put('/update', cartController.updateAmount);
router.delete('/remove', cartController.removeItem);

module.exports = router;
