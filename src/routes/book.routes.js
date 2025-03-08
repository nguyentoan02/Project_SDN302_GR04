const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const reviewController = require('../controllers/review.controller');
const { registerRoute } = require('./register.routes');
const { authMiddleware } = require('../middleware/auth');
const multer = require('multer');
const upload = multer();

// 📌 Xem danh sách sách
router.get('/', bookController.listBooks);

// 📌 Lọc sách
router.get('/filter', bookController.filterBooks);
//
router.get('/filterAll', bookController.filterByAll);
// 📌 Xem chi tiết sách
router.get('/:slug', bookController.bookDetail);

router.get('/:slug/reviews', reviewController.getAllReviews);

router.post('/:slug/reviews', authMiddleware, upload.none(), reviewController.createReview);

router.put('/:slug/reviews/:id', authMiddleware, reviewController.updateReview);

router.delete('/:slug/reviews/:id', authMiddleware, reviewController.deleteReview);

registerRoute('/books', router);

module.exports = router;
