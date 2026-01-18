import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, DecodedToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';
import { prisma } from '../lib/prisma.js';
import { UserType } from '@prisma/client';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phone: string;
        userType: UserType;
        authMethod: 'OTP' | 'PASSWORD';
      };
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded: DecodedToken = verifyAccessToken(token);

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        phone: true,
        userType: true,
        authMethod: true,
      },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(401, error.message));
    } else {
      next(new AppError(401, 'Authentication failed'));
    }
  }
};

/**
 * Middleware to require specific user type(s)
 */
export const requireRole = (...allowedRoles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.userType)) {
      next(
        new AppError(
          403,
          `Access denied. Required role: ${allowedRoles.join(' or ')}`
        )
      );
      return;
    }

    next();
  };
};

/**
 * Middleware to require customer role
 */
export const requireCustomer = requireRole(UserType.CUSTOMER);

/**
 * Middleware to require driver role
 */
export const requireDriver = requireRole(UserType.DRIVER);
