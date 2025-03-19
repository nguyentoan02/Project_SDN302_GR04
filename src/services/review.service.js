const Review = require('../models/Review');

const getAllReviews = async () => {
  const reviews = await Review.find();

  if (!reviews || reviews.length === 0) {
    throw new NotFoundError('Reviews');
  }

  return reviews;
};

const createReview = async (reviewParam) => {
  const review = new Review(reviewParam);
  const savedReview = await review.save();
  if (!savedReview) {
    throw new Error('Failed to create review');
  }
  return savedReview;
};

const updateReview = async (id, reviewParam) => {
  const review = await Review.findByIdAndUpdate(id, reviewParam, { new: true });
  if (!review) {
    throw new NotFoundError('Review');
  }
  return review;
};

const deleteReview = async (id) => {
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    throw new NotFoundError('Review');
  }
  return review;
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview
};
