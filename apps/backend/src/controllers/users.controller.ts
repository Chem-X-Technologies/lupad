import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import type { UpdateUserInput, GetUserParams } from '../schemas/users.schema.js';

/**
 * Get current user profile
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        userType: true,
        authMethod: true,
        createdAt: true,
        updatedAt: true,
        driver: {
          select: {
            id: true,
            vehicleType: true,
            licenseNumber: true,
            plateNumber: true,
            isVerified: true,
            isAvailable: true,
            rating: true,
            totalRides: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 */
export const updateMe = async (
  req: Request<{}, {}, UpdateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { name, email } = req.body;

    // Build update data (only include fields that are provided)
    const updateData: { name?: string; email?: string | null } = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email === '' ? null : email;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      throw new AppError(400, 'No fields to update');
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        userType: true,
        authMethod: true,
        createdAt: true,
        updatedAt: true,
        driver: {
          select: {
            id: true,
            vehicleType: true,
            licenseNumber: true,
            plateNumber: true,
            isVerified: true,
            isAvailable: true,
            rating: true,
            totalRides: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete current user account
 * Note: For MVP, we'll do a hard delete. Soft delete can be implemented later.
 */
export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    // Check if user has active rides
    const activeRide = await prisma.ride.findFirst({
      where: {
        OR: [
          { customerId: req.user.id },
          { driverId: req.user.id },
        ],
        status: {
          in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'],
        },
      },
    });

    if (activeRide) {
      throw new AppError(400, 'Cannot delete account with active rides');
    }

    // Delete user (cascades to driver profile if exists)
    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (public profile - limited info)
 */
export const getUserById = async (
  req: Request<GetUserParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        userType: true,
        createdAt: true,
        driver: {
          select: {
            vehicleType: true,
            rating: true,
            totalRides: true,
            isVerified: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
