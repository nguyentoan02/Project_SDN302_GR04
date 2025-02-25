const mongoose = require('mongoose');
// models/Order.js
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentMethod: { type: String, enum: ['cash', 'e-wallet'] },
  orderDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
