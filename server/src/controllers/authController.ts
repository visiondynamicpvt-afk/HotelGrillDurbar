import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { AuthRequest } from '../middleware/auth.js';

// Generate JWT Token
const generateToken = (id: string, username: string, role: string): string => {
  return jwt.sign({ id, username, role }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'],
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
      return;
    }

    // Mock admin login - accept admin/admin123
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      // Generate token for mock admin
      const token = generateToken('mock_admin_id', 'admin', 'admin');

      res.status(200).json({
        success: true,
        token,
        user: {
          id: 'mock_admin_id',
          username: 'admin',
          email: 'admin@hotelgrilldurbar.com',
          role: 'admin',
        },
      });
      return;
    }

    // Attempt database implementation:
    // Find admin and include password
    const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if password matches
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken(admin._id.toString(), admin.username, admin.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verify = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    // Handle mock admin
    if (req.user.id === 'mock_admin_id') {
      res.status(200).json({
        success: true,
        user: {
          id: 'mock_admin_id',
          username: 'admin',
          email: 'admin@hotelgrilldurbar.com',
          role: 'admin',
        },
      });
      return;
    }

    // Check database for real admin
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Admin not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
