const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/user.controller');
const { registerRoute } = require('./register.routes');

router.get('/', getUsers); // Lấy danh sách user
router.post('/create', createUser); // Tạo user mới

registerRoute('/users', router);

module.exports = router;
