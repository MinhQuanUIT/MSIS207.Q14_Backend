const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');

// Admin only routes
router.get('/', verifyToken, isAdmin, getUsers);
router.post('/', verifyToken, isAdmin, createUser);

// Protected routes - user can access their own data or admin can access any
router.get('/:id', verifyToken, getUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser); // Only admin can delete users

module.exports = router;
