// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['shopper', 'admin'], default: 'shopper' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
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
  ]
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
