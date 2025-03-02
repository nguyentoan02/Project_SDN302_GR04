const express = require('express');
const router = express.Router();
const globalAsyncHandler = require('../../middleware/handler');
const axios = require('../../config/axios');

// globalAsyncHandler(router);

router.get('/cart', async (req, res) => {
  const { data } = await axios.get('/cart/products');
  // console.log({ carts: data.cart });
  res.render('pages/cart/cart', {
    title: 'Cart',
    user: req.user,
    carts: data.cart || []
  });
});

module.exports = router;
