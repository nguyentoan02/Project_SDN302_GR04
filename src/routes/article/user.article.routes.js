const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/article.controller');
const { registerRoute } = require('../register.routes');
const globalAsyncHandler = require('../../middleware/handler');
const { authMiddleware } = require('../../middleware/auth');

// Áp dụng globalAsyncHandler
globalAsyncHandler(router);

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/:id/comment', authMiddleware, articleController.addComment);

registerRoute('/articles', router);

module.exports = router;
