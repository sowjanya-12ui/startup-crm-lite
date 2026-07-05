import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Explicitly request password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);
    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ success: false, message: 'Please provide old password to set a new password' });
      }
      if (!(await user.comparePassword(oldPassword))) {
        return res.status(401).json({ success: false, message: 'Invalid old password' });
      }
      user.password = newPassword;
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
