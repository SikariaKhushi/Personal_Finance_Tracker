const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
      const { name, type, description, color } = req.body;
      const category = new Category({ name, type, userId: req.user.id, description, color });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, type, description, color } = req.body;  // Include description and color if needed
  
      // Update the category with the provided fields
      const category = await Category.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { name, type, description, color },  // Make sure description and color are also updated
        { new: true, runValidators: true }
      );
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};