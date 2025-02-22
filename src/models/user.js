// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['shopper', 'admin'], default: 'shopper' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});
module.exports = mongoose.model('User', UserSchema);









