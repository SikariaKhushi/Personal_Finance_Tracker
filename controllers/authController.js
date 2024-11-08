const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.generateToken();
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
