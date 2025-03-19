const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/article.controller');
const multer = require('multer');
const { registerRoute } = require('../register.routes');
const globalAsyncHandler = require('../../middleware/handler');
const { authMiddleware, checkUserRole } = require('../../middleware/auth'); // Import middleware

// Cấu hình multer với memoryStorage (lưu vào buffer thay vì disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Chỉ chấp nhận file JPG, PNG, JPEG'));
    }
    cb(null, true);
  }
});

globalAsyncHandler(router);

router.use(authMiddleware, checkUserRole('admin'));

router.get('/', articleController.getAllArticlesAdmin);
router.get('/create', articleController.getCreateForm);
router.post('/', upload.single('image'), articleController.createArticle);
router.get('/:id/edit', articleController.getEditForm);
router.put('/:id', upload.single('image'), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

registerRoute('admin/articles', router);

module.exports = router;