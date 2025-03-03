const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller'); // Updated import
const { registerRoute } = require('./register.routes');

// Add to favorites (was wishlist)
router.post('/:productId', favoritesController.addToWishlist);

// Get favorites
router.get('/', favoritesController.getWishlist);
// Remove from favorites
router.delete('/:productId', favoritesController.removeFromWishlist);

registerRoute('favorites', router);

module.exports = router;
