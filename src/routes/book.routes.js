const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { registerRoute } = require('./register.routes');

// 📌 Xem danh sách sách
router.get('/', bookController.listBooks);

// 📌 Lọc sách
router.get('/filter', bookController.filterBooks);
//
router.get('/filterAll', bookController.filterByAll);
// 📌 Xem chi tiết sách
router.get('/:slug', bookController.bookDetail);

registerRoute('/books', router);

module.exports = router;
