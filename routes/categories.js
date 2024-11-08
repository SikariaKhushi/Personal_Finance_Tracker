const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.use(auth);
router.route('/').post(createCategory).get(getCategories);
router.route('/:id').put(updateCategory).delete(deleteCategory);

module.exports = router;