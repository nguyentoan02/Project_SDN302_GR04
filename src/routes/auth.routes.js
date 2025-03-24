const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerRoute } = require('./register.routes');
const globalAsyncHandler = require('../middleware/handler');
const { authMiddleware, checkUserRole } = require('../middleware/auth');

globalAsyncHandler(router);

router.get('/', authController.getLoginForm);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/home', authController.home);
router.get('/profile', authMiddleware, authController.profile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/dashboard', authMiddleware, checkUserRole('admin'), authController.dashboard);
router.get('/me', authMiddleware, authController.getMe);

registerRoute('/auth', router);

module.exports = router;
