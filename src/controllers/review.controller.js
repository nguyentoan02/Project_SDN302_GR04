const reviewService = require('../services/review.service');
const Product = require('../models/Product');

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const book = await Product.findOne({ slug });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const reviewData = {
      ...req.body,
      productId: book._id,
      userId: req.user._id
    };

    const review = await reviewService.createReview(reviewData);

    await Product.findByIdAndUpdate(book._id, { $push: { reviews: review._id } });

    res.status(201).json({ success: true, message: 'Đánh giá đã được gửi thành công!' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Internal server error', error: error.message });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const book = await Product.findOne({ slug });
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    // Fetch the review to check ownership
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }

    // Check if the current user is the review's creator
    if (review.userId.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ status: 'error', message: 'Bạn không có quyền sửa đánh giá này' });
    }

    const updatedReview = await reviewService.updateReview(req.params.id, req.body);
    res
      .status(200)
      .json({ success: true, message: 'Đánh giá đã được cập nhật!', data: updatedReview });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const book = await Product.findOne({ slug });
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    // Fetch the review to check ownership
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ status: 'error', message: 'Review not found' });
    }

    // Check if the current user is the review's creator
    if (review.userId.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ status: 'error', message: 'Bạn không có quyền xóa đánh giá này' });
    }

    await reviewService.deleteReview(req.params.id);
    await Product.findByIdAndUpdate(book._id, { $pull: { reviews: req.params.id } });

    res.status(200).json({ success: true, message: 'Đánh giá đã được xóa!' });
  } catch (error) {
    next(error);
  }
};
