import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

// NOTE: add express-rate-limit middleware here in production to protect login and register endpoints
// router.use(rateLimiter);

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

export default router;
