import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
        id: string;
        username: string;
        role: string;
      };

      // Handle mock admin (for development/testing)
      if (decoded.id === 'mock_admin_id') {
        req.user = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        };
        next();
        return;
      }

      // Check if admin exists in database
      const admin = await Admin.findById(decoded.id).select('-password');
      
      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Admin not found',
        });
        return;
      }

      req.user = {
        id: admin._id.toString(),
        username: admin.username,
        role: admin.role,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
    return;
  }
};