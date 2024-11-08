const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
      const { username, email, password, monthlyBudget } = req.body;
      const user = new User({ username, email, password, monthlyBudget });
      await user.save();
      const token = user.generateToken();
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, monthlyBudget } = req.body;
      const updateData = { username, email, monthlyBudget };
      
      if (password) {
        // Re-hash password if it's being updated
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
  
      const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};