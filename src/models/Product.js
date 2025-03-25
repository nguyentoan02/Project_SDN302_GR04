const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  publisher: { type: String, required: true, trim: true },
  publishYear: { type: Number, required: true },
  pages: { type: Number, min: 1, required: true },
  dimensions: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, unique: true }
});

// Generate slug and update timestamp before saving
ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
