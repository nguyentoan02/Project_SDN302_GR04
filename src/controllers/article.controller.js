const articleService = require('../services/article.service');
const sanitizeHtml = require('sanitize-html');
const Article = require('../models/Article');
const cloudinary = require('../config/cloudinary');

exports.getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Số bài viết mỗi trang
    const skip = (page - 1) * limit;

    const totalArticles = await Article.countDocuments();
    const articles = await articleService.getAllArticles({ skip, limit });

    const totalPages = Math.ceil(totalArticles / limit);

    res.status(200).render('articles/list', {
      articles,
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      limit
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllArticlesAdmin = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total number of articles
    const totalArticles = await Article.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalArticles / limit);

    // Fetch articles for current page
    const articles = await Article.find().skip(skip).limit(limit).sort({ createdAt: -1 }); // Optional: sort by creation date

    // Render the view with all required variables
    res.render('articles/adminArticle', {
      articles: articles,
      currentPage: page,
      totalPages: totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      limit: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate({ path: 'createdBy', select: 'username' }) // Lấy thông tin người tạo bài viết
      .populate({ path: 'comments.author', select: 'fullname avatar' }); // Lấy thông tin người bình luận

    if (!article) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    // Debug
    article.comments.forEach((comment) => {
      const imgSrc =
        comment.author && comment.author.avatar
          ? comment.author.avatar
          : '/images/author/imag-24.jpg';
      console.log('Image src:', imgSrc);
    });

    // Tăng lượt xem
    article.views += 1;
    await article.save();

    res.render('articles/detail', { article });
  } catch (error) {
    next(error);
  }
};

// Hiển thị form tạo bài viết

exports.getCreateForm = (req, res) => {
  res.render('articles/create');
};

exports.createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    let cleanContent = Array.isArray(content) ? content[0] || '' : content || '';
    cleanContent = sanitizeHtml(cleanContent, {
      allowedTags: [
        'p',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'div',
        'span',
        'ul',
        'ol',
        'li',
        'table',
        'tr',
        'td',
        'th'
      ],
      allowedAttributes: { '*': ['style', 'align', 'background-color'] }
    });

    const articleParam = {
      title: title || '',
      content: cleanContent,
      createdBy: req.user.id
    };

    // Handle image upload if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'bookstore/articles' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        articleParam.image = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          status: 'error',
          message: 'Lỗi upload ảnh',
          error: uploadError.message
        });
      }
    }

    const article = await articleService.createArticle(articleParam);
    console.log('Article saved:', article);
    res.redirect('/api/admin/articles');
  } catch (error) {
    console.error('Error in createArticle:', error);
    next(error);
  }
};

exports.getEditForm = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.render('articles/edit', { article });
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = await articleService.getArticleById(req.params.id);

    if (!article) {
      return res.status(404).json({
        status: 'error',
        message: 'Bài viết không tồn tại'
      });
    }

    // Update fields if provided
    if (title) article.title = title;
    if (content) {
      let cleanContent = Array.isArray(content) ? content[0] || '' : content || '';
      article.content = sanitizeHtml(cleanContent, {
        allowedTags: [
          'p',
          'strong',
          'em',
          'u',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'div',
          'span',
          'ul',
          'ol',
          'li',
          'table',
          'tr',
          'td',
          'th'
        ],
        allowedAttributes: { '*': ['style', 'align', 'background-color'] }
      });
    }
    article.updatedAt = new Date();

    // Handle image upload if new image is provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'bookstore/articles' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        article.image = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          status: 'error',
          message: 'Lỗi upload ảnh',
          error: uploadError.message
        });
      }
    }

    const updatedArticle = await article.save();
    console.log('Article updated:', updatedArticle);
    res.redirect('/api/admin/articles');
  } catch (error) {
    console.error('Error in updateArticle:', error);
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await articleService.deleteArticle(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(204).send(); // Dùng send() thay vì json() cho status 204
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const commentContent = req.body.content;

    if (!commentContent) {
      return res.redirect(`/api/articles/${articleId}`);
    }

    const commentParam = {
      content: commentContent,
      author: req.user.id,
      createdAt: new Date()
    };

    const article = await articleService.addComment(articleId, commentParam);
    console.log('Comment added to article:', article);

    // Add success message
    res.redirect(`/api/articles/${articleId}`);
  } catch (error) {
    console.error('Error in addComment:', error);
    res.redirect(`/api/articles/${articleId}`);
  }
};
