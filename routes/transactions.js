const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Authentication middleware
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getMonthlyReport,
  searchTransactions,
  searchCategories,
} = require('../controllers/transactionController'); // Correct import of controllers

// Apply auth middleware to all routes
router.use(auth);

// CRUD routes for transactions
router.route('/').post(createTransaction).get(getTransactions);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

// Additional routes for reporting and search
router.get('/report/monthly', getMonthlyReport);
router.get('/search', searchTransactions);
router.get('/categories/search', searchCategories);

module.exports = router;
