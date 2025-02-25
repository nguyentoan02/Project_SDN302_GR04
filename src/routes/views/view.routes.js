const express = require('express');
const router = express.Router();
const globalAsyncHandler = require('../../middleware/handler');

globalAsyncHandler(router);

router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Home',
    user: req.user,
    data: {
      products: []
    }
  });
});

module.exports = router;
