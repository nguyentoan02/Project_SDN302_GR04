const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/user.controller');

router.get('/', getUsers); // Lấy danh sách user
router.post('/create', createUser); // Tạo user mới

module.exports = router;
