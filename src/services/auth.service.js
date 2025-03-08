const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Đường dẫn tới file model
const { AUTH, HTTP_STATUS, MESSAGES } = require('../utils/constant');

class AuthService {
  // Đăng ký người dùng
  async register({ username, email, password }) {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw {
        status: HTTP_STATUS.CONFLICT,
        message: 'Tên người dùng hoặc email đã tồn tại'
      };
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || AUTH.JWT_SECRET,
      { expiresIn: AUTH.JWT_EXPIRES_IN }
    );

    return { token, user: { id: user._id, username, email, role: user.role } };
  }

  // Đăng nhập người dùng
  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.INVALID_CREDENTIALS
      };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.INVALID_CREDENTIALS
      };
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        fullname: user.fullname,
        avatar: user.avatar
      },
      process.env.JWT_SECRET || AUTH.JWT_SECRET,
      { expiresIn: AUTH.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email,
        role: user.role,
        fullname: user.fullname,
        avatar: user.avatar
      }
    };
  }

  async updateProfile(userId, data) {
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
    return user;
  }
}

module.exports = new AuthService();
