import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface UserAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user';
  };
}

export const generateUserToken = (payload: { id: string; email: string }): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign(
    {
      ...payload,
      role: 'user',
    },
    secret,
    { expiresIn } as SignOptions
  );
};

export const protectUser = async (req: UserAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload & {
      id?: string;
      email?: string;
      role?: string;
    };

    if (!decoded.id || !decoded.email || decoded.role !== 'user') {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: 'user',
    };

    if (req.params.userId && req.params.userId !== decoded.id) {
      res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};
