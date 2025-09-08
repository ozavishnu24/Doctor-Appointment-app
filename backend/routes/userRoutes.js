const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const router = express.Router();

// User profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Add this route for /me
router.get('/me', protect, getUserProfile);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;