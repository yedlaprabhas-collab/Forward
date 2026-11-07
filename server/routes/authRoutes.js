const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const registerValidation = [
  body('name', 'Name is required').trim().notEmpty(),
  body('email', 'Please provide a valid email address').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('phone', 'Phone number is required').trim().notEmpty(),
  body('address', 'Address is required').trim().notEmpty(),
];

const loginValidation = [
  body('email', 'Please provide a valid email address').isEmail().normalizeEmail(),
  body('password', 'Password is required').notEmpty(),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
