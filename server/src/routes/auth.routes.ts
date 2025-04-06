import express from 'express';
import { check } from 'express-validator';
import { register, login, getMe, updatePassword } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', verifyToken, getMe);

// @route   PUT /api/auth/updatepassword
// @desc    Update user password
// @access  Private
router.put(
  '/updatepassword',
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
  ],
  verifyToken,
  updatePassword
);

export default router; 