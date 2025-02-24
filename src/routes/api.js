const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const globalAsyncHandler = require('../middleware/handler');

// Apply global async handler to router
globalAsyncHandler(router);

router.get('/users', userController.getUsers);
router.post('/users/create', userController.createUser);

module.exports = router;
