import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from Bearer header
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET || 'dev_jwt_secret_key_student_task_manager_2026';
      const decoded = jwt.verify(token, secret);

      // Fetch user without password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or token invalid' });
      }

      next();
    } catch (error) {
      console.error('[Auth Error]', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
