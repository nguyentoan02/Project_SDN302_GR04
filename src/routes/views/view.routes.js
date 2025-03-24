const express = require('express');
const router = express.Router();
const globalAsyncHandler = require('../../middleware/handler');
const axios = require('../../config/axios');

globalAsyncHandler(router);

router.get('/', (req, res) => {
  res.redirect('/api/auth/home');
});

router.get('/cart', async (req, res) => {
  const { data } = await axios.get('/cart/products');
  res.render('pages/cart/cart', {
    title: 'Cart',
    user: req.user,
    carts: data.cart || []
  });
});

router.get('/orders/history', async (req, res) => {
  const { data } = await axios.get('/orders/all');
  console.log(data);
  res.render('pages/order/orderHistory', {
    title: 'Order History',
    user: req.user,
    orders: data || []
  });
});

router.get('/orders/success', async (req, res) => {
  res.render('pages/order/orderSuccess', {
    title: 'Order Response',
    user: req.user,
    orders: data || []
  });
});

module.exports = router;
