const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const { registerRoute } = require('./register.routes');
const { authMiddleware } = require('../middleware/auth');

// Áp dụng authMiddleware nhưng không bắt buộc (optional)
router.post('/:productId', authMiddleware, favoritesController.addToWishlist);

router.get('/', authMiddleware, favoritesController.getWishlist);

router.delete('/:productId', authMiddleware, favoritesController.removeFromWishlist);

registerRoute('favorites', router);

module.exports = router;
