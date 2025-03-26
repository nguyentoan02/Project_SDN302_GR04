const AuthService = require('../services/auth.service');
const { HTTP_STATUS, MESSAGES } = require('../utils/constant');
const Product = require('../models/Product');
class AuthController {
  // Đăng ký

  async home(req, res) {
    try {
      const books = await Product.find().lean(); // Lấy tất cả sách từ MongoDB
      res.render('pages/home', { title: 'Home', books, name: '' }); // Truyền books và name
    } catch (error) {
      console.error('❌ Lỗi khi tải trang chủ:', error);
      res.status(500).send('Lỗi server');
    }
  }

  async dashboard(req, res) {
    res.set('Cache-Control', 'no-store'); // Ngăn cache
    res.render('pages/dashboard', { user: req.user }); // Truyền req.user
  }

  async getLoginForm(req, res) {
    const { redirect, message } = req.query;
    res.render('auth/login', {
      title: 'Login',
      redirect: redirect || '/',
      message: message || ''
    });
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: MESSAGES.VALIDATION_ERROR,
          message: 'Vui lòng cung cấp đầy đủ username, email và password'
        });
      }

      const result = await AuthService.register({ username, email, password });
      res.status(HTTP_STATUS.CREATED).json({
        message: MESSAGES.SUCCESS,
        data: result
      });
    } catch (error) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER).json({
        error: MESSAGES.ERROR,
        message: error.message
      });
    }
  }

  // Đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: MESSAGES.VALIDATION_ERROR,
          message: 'Vui lòng cung cấp email và password'
        });
      }

      const result = await AuthService.login({ email, password });
      const token = result.token;

      // Gắn token vào cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.SUCCESS,
        data: result.user
      });
    } catch (error) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER).json({
        error: MESSAGES.ERROR,
        message: error.message
      });
    }
  }
  async getMe(req, res) {
    try {
      // req.user đã được gán bởi authMiddleware từ cookie
      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.SUCCESS,
        data: {
          id: req.user._id,
          username: req.user.username,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        error: MESSAGES.ERROR,
        message: error.message
      });
    }
  }
  async logout(req, res) {
    try {
      res.clearCookie('token');

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.SUCCESS,
        data: { message: 'Logged out successfully' }
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        error: MESSAGES.ERROR,
        message: error.message
      });
    }
  }
  async profile(req, res) {
    try {
      res.render('auth/profile', { user: req.user });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        error: MESSAGES.ERROR,
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { fullname, address, dateOfBirth, gender, avatar } = req.body;
      const result = await AuthService.updateProfile(req.user._id, {
        fullname,
        address,
        dateOfBirth,
        gender,
        avatar
      });
      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.SUCCESS,
        data: result
      });
    } catch (error) {
      res.status(error.status || HTTP_STATUS.INTERNAL_SERVER).json({
        error: MESSAGES.ERROR,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
