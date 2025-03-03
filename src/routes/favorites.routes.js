const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller'); // Updated import

// Add to favorites (was wishlist)
router.post('/:productId', favoritesController.addToWishlist);

// Get favorites
router.get('/', favoritesController.getWishlist);
// Remove from favorites
router.delete('/:productId', favoritesController.removeFromWishlist);

module.exports = router;
