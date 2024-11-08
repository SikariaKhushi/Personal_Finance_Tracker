const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.post('/register', createUser);
router.get('/', auth, getUsers);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;