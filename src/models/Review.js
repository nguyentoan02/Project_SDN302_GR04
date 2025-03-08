const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  reviewDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` on modification
ReviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update Product's averageRating and reviewCount after a review is saved
ReviewSchema.post('save', async function (doc) {
  const Product = mongoose.model('Product');
  const productId = doc.productId;
  
  // Fetch all reviews for this product
  const reviews = await this.model('Review').find({ productId });
  const reviewCount = reviews.length;
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;

  // Update the Product document
  await Product.updateOne(
    { _id: productId },
    { 
      averageRating, 
      reviewCount, 
      updatedAt: Date.now() 
    }
  );
});

module.exports = mongoose.model('Review', ReviewSchema);