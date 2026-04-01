import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateUserToken, UserAuthRequest } from '../middleware/userAuth.js';

const sanitizeProfileResponse = (user: any) => ({
  id: user._id?.toString?.() || user.id,
  email: user.email,
  name: user.name,
  phone: user.phone,
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: typeof name === 'string' ? name.trim() : undefined,
    });

    const token = generateUserToken({
      id: user._id.toString(),
      email: user.email,
    });

    res.status(201).json({
      success: true,
      token,
      user: sanitizeProfileResponse(user),
      message: 'Account created successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create account',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateUserToken({
      id: user._id.toString(),
      email: user.email,
    });

    res.status(200).json({
      success: true,
      token,
      user: sanitizeProfileResponse(user),
      message: 'Login successful',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to login',
    });
  }
};

export const getCurrentUser = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sanitizeProfileResponse(user),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch current user',
    });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sanitizeProfileResponse(user),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile',
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, phone, email } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const update: Record<string, string> = {};

    if (typeof name === 'string') {
      update.name = name;
    }

    if (typeof phone === 'string') {
      update.phone = phone;
    }

    if (typeof email === 'string') {
      update.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: update,
      },
      { new: true }
    ).lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sanitizeProfileResponse(user),
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user profile',
    });
  }
};

export const changeUserPassword = async (req: UserAuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
      return;
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (user.password) {
      if (!currentPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password is required',
        });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
        return;
      }
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update password',
    });
  }
};
