const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category'); 

exports.createTransaction = async (req, res) => {
    try {
      const { amount, description, type, categoryName, tags } = req.body;
  
      // Automatically set the date to the current date
      const date = new Date();
  
      // Set location automatically (You can modify this logic later to fetch from a geolocation service)
      const location = {
        type: 'Point',
        coordinates: [-73.935242, 40.730610]  // Default to NYC coordinates, modify as needed
      };
  
      // Find the category by name (assuming the category name is unique)
      const category = await Category.findOne({ name: categoryName });
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Create a new transaction with the category _id
      const transaction = new Transaction({
        amount,
        description,
        date,
        type,
        categoryId: category._id,  // Use the category _id
        userId: req.user.id,
        tags,
        location
      });
  
      // Save the transaction
      await transaction.save();
  
      // Return the created transaction
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  exports.getTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find({ userId: req.user.id })
        .populate('categoryId', 'name type')
        .sort({ date: -1 });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.updateTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, description, type, categoryName, tags } = req.body;
  
      // Find the category by name (assuming the category name is unique)
      const category = categoryName ? await Category.findOne({ name: categoryName }) : null;
  
      if (categoryName && !category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      const updateData = {
        amount,
        description,
        type,
        tags
      };
  
      if (category) {
        updateData.categoryId = category._id;  // Update category _id if it's provided
      }
  
      // Update the transaction
      const transaction = await Transaction.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Return the updated transaction
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
    try {
      // Ensure the userId is passed as a valid ObjectId
      const userId = new mongoose.Types.ObjectId(req.user.id);
  
      const report = await Transaction.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              type: '$type',
            },
            total: { $sum: '$amount' },
          },
        },
        {
          $sort: { '_id.year': -1, '_id.month': -1 },
        },
      ]);
  
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.searchTransactions = async (req, res) => {
    try {
      const { searchTerm = '' } = req.query;
      const results = await Transaction.find(
        { $text: { $search: searchTerm }, userId: req.user.id },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.searchCategories = async (req, res) => {
    try {
      const { searchTerm = '' } = req.query;
      const results = await Category.find(
        { $text: { $search: searchTerm }, userId: req.user.id },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };