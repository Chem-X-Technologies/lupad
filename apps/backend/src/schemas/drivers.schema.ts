import { z } from 'zod';

/**
 * Update driver profile schema
 */
export const updateDriverSchema = z.object({
  vehicleType: z
    .string()
    .min(2, 'Vehicle type must be at least 2 characters')
    .max(50, 'Vehicle type must not exceed 50 characters')
    .optional(),
  licenseNumber: z
    .string()
    .min(5, 'License number must be at least 5 characters')
    .max(50, 'License number must not exceed 50 characters')
    .optional(),
  plateNumber: z
    .string()
    .min(5, 'Plate number must be at least 5 characters')
    .max(20, 'Plate number must not exceed 20 characters')
    .optional(),
});

/**
 * Update vehicle info schema
 */
export const updateVehicleSchema = z.object({
  vehicleType: z
    .string()
    .min(2, 'Vehicle type must be at least 2 characters')
    .max(50, 'Vehicle type must not exceed 50 characters'),
  licenseNumber: z
    .string()
    .min(5, 'License number must be at least 5 characters')
    .max(50, 'License number must not exceed 50 characters'),
  plateNumber: z
    .string()
    .min(5, 'Plate number must be at least 5 characters')
    .max(20, 'Plate number must not exceed 20 characters'),
});

/**
 * Update driver availability schema
 */
export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

/**
 * Get driver by ID params schema
 */
export const getDriverParamsSchema = z.object({
  id: z.string().uuid('Invalid driver ID format'),
});

/**
 * Type exports for controllers
 */
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type GetDriverParams = z.infer<typeof getDriverParamsSchema>;
