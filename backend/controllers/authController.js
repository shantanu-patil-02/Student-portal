import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_key_student_task_manager_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields: name, email, password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'A student account with this email already exists' });
    }

    // Create user in MongoDB
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      return res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid student user data received' });
    }
  } catch (error) {
    console.error('[Register Error]', error.message);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const enteredPassword = (password || '').trim();

    // Check for user
    const user = await User.findOne({ email: cleanEmail });

    // Compare with both raw and trimmed password to avoid invisible space or copy-paste issues
    const isMatch = user && ((await user.matchPassword(password)) || (await user.matchPassword(enteredPassword)));

    if (user && isMatch) {
      return res.status(200).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Login Error]', error.message);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    return res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error('[GetMe Error]', error.message);
    return res.status(500).json({ message: 'Server error retrieving user data' });
  }
};
