const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES, AUTH, VALIDATION } = require('../utils/constant');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Vui lòng cung cấp tên người dùng'],
    unique: true,
    minlength: VALIDATION.MIN_USERNAME_LENGTH,
    maxlength: VALIDATION.MAX_USERNAME_LENGTH
  },
  email: {
    type: String,
    required: [true, 'Vui lòng cung cấp email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Vui lòng cung cấp mật khẩu'],
    minlength: VALIDATION.MIN_PASSWORD_LENGTH,
    maxlength: VALIDATION.MAX_PASSWORD_LENGTH,
    select: false
  },
  fullname: {
    type: String,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  address: {
    type: String,
    maxlength: 200,
    trim: true,
    default: ''
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: 'Ngày sinh không thể ở tương lai'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  avatar: {
    type: String,
    default: '/images/author/imag-24.jpg',
    match: [
      /^https?:\/\/.*\.(jpg|jpeg|png|gif)$|^[^ ]+$/,
      'URL ảnh không hợp lệ hoặc không phải định dạng hỗ trợ'
    ]
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updateAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Mã hóa mật khẩu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, AUTH.SALT_ROUNDS);
  next();
});

// So sánh mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
