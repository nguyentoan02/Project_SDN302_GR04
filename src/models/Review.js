// models/Review.js
const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: Number,
    comment: String,
    reviewDate: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model('Review', ReviewSchema);