const Article = require('../models/Article');
const { NotFoundError, ValidationError, DatabaseError } = require('../core/error');

const getAllArticles = async ({ skip = 0, limit = 5 } = {}) => {
  try {
    const articles = await Article.find()
      .populate({ path: 'createdBy', select: 'username' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return articles;
  } catch (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }
};

const getArticleById = async (id) => {
  const article = await Article.findById(id);

  if (!article) {
    throw new NotFoundError('Article');
  }

  return article;
};

const createArticle = async (articleParam) => {
  console.log('articleService.createArticle called with:', articleParam); // Debug
  const article = new Article(articleParam);
  const savedArticle = await article.save();
  if (!savedArticle) {
    throw new Error('Failed to create article');
  }
  return savedArticle;
};
const updateArticle = async (id, articleParam) => {
  const article = await Article.findByIdAndUpdate(id, articleParam, { new: true });
  if (!article) {
    throw new NotFoundError('Article');
  }
  return article;
};

const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);
  if (!article) {
    throw new NotFoundError('Article');
  }
  return article;
};

const addComment = async (articleId, commentParam) => {
  console.log('articleService.addComment called with:', { articleId, commentParam });

  const article = await Article.findByIdAndUpdate(
    articleId,
    { $push: { comments: commentParam } },
    { new: true } // Trả về document đã cập nhật
  );

  if (!article) {
    throw new Error('Article not found');
  }

  return article;
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  deleteArticle,
  updateArticle,
  addComment
};
