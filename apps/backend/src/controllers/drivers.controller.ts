import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { redisHelpers } from '../lib/redis.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
  UpdateDriverInput,
  UpdateVehicleInput,
  UpdateAvailabilityInput,
  GetDriverParams,
} from '../schemas/drivers.schema.js';

/**
 * Get current driver profile
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

    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            email: true,
            userType: true,
            authMethod: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!driver) {
      throw new AppError(404, 'Driver profile not found');
    }

    res.status(200).json({
      success: true,
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current driver profile
 */
export const updateMe = async (
  req: Request<{}, {}, UpdateDriverInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { vehicleType, licenseNumber, plateNumber } = req.body;

    // Build update data (only include fields that are provided)
    const updateData: {
      vehicleType?: string;
      licenseNumber?: string;
      plateNumber?: string;
    } = {};

    if (vehicleType !== undefined) {
      updateData.vehicleType = vehicleType;
    }

    if (licenseNumber !== undefined) {
      updateData.licenseNumber = licenseNumber;
    }

    if (plateNumber !== undefined) {
      updateData.plateNumber = plateNumber;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      throw new AppError(400, 'No fields to update');
    }

    const driver = await prisma.driver.update({
      where: { userId: req.user.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            email: true,
            userType: true,
            authMethod: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Driver profile updated successfully',
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update vehicle information
 */
export const updateVehicle = async (
  req: Request<{}, {}, UpdateVehicleInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { vehicleType, licenseNumber, plateNumber } = req.body;

    const driver = await prisma.driver.update({
      where: { userId: req.user.id },
      data: {
        vehicleType,
        licenseNumber,
        plateNumber,
        // Reset verification status when vehicle info changes
        isVerified: false,
      },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            name: true,
            email: true,
            userType: true,
            authMethod: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle information updated successfully. Verification status has been reset.',
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update driver availability status
 */
export const updateAvailability = async (
  req: Request<{}, {}, UpdateAvailabilityInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const { isAvailable } = req.body;

    // Check if driver is verified before allowing them to go online
    const existingDriver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      select: { isVerified: true },
    });

    if (!existingDriver) {
      throw new AppError(404, 'Driver profile not found');
    }

    if (isAvailable && !existingDriver.isVerified) {
      throw new AppError(400, 'Cannot go online until your account is verified');
    }

    // Check if driver has active ride when trying to go offline
    if (!isAvailable) {
      const activeRide = await prisma.ride.findFirst({
        where: {
          driverId: req.user.id,
          status: {
            in: ['ACCEPTED', 'IN_PROGRESS'],
          },
        },
      });

      if (activeRide) {
        throw new AppError(400, 'Cannot go offline while you have an active ride');
      }
    }

    // Update driver availability in database
    const driver = await prisma.driver.update({
      where: { userId: req.user.id },
      data: { isAvailable },
      select: {
        id: true,
        isAvailable: true,
        isVerified: true,
      },
    });

    // Update Redis cache for quick availability lookup
    if (isAvailable) {
      await redisHelpers.set(`driver:available:${driver.id}`, 'true');
    } else {
      await redisHelpers.del(`driver:available:${driver.id}`);
    }

    res.status(200).json({
      success: true,
      message: isAvailable ? 'You are now online' : 'You are now offline',
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get driver by ID (public profile)
 */
export const getDriverById = async (
  req: Request<GetDriverParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const driver = await prisma.driver.findUnique({
      where: { id },
      select: {
        id: true,
        vehicleType: true,
        plateNumber: true,
        isVerified: true,
        rating: true,
        totalRides: true,
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    if (!driver) {
      throw new AppError(404, 'Driver not found');
    }

    res.status(200).json({
      success: true,
      data: { driver },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get driver statistics
 */
export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
      select: {
        id: true,
        rating: true,
        totalRides: true,
      },
    });

    if (!driver) {
      throw new AppError(404, 'Driver profile not found');
    }

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRides = await prisma.ride.count({
      where: {
        driverId: req.user.id,
        status: 'COMPLETED',
        completedAt: {
          gte: today,
        },
      },
    });

    const todayEarnings = await prisma.ride.aggregate({
      where: {
        driverId: req.user.id,
        status: 'COMPLETED',
        completedAt: {
          gte: today,
        },
      },
      _sum: {
        fare: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          rating: driver.rating,
          totalRides: driver.totalRides,
          todayRides,
          todayEarnings: todayEarnings._sum.fare || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
