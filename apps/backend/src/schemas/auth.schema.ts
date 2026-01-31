import { z } from 'zod';
import { UserType, AuthMethod } from '@prisma/client';

/**
 * Philippine phone number validation
 * Formats: +639XXXXXXXXX, 639XXXXXXXXX, 09XXXXXXXXX
 */
const phoneRegex = /^(\+639|639|09)\d{9}$/;

/**
 * Password validation
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Register schema - for both customers and drivers
 */
export const registerSchema = z.object({
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid Philippine phone number format')
    .transform((val) => {
      // Normalize to +639XXXXXXXXX format
      if (val.startsWith('09')) {
        return `+63${val.substring(1)}`;
      }
      if (val.startsWith('639')) {
        return `+${val}`;
      }
      return val;
    }),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  userType: z.nativeEnum(UserType).describe('User type must be CUSTOMER or DRIVER'),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
    )
    .optional(),
  // Driver-specific fields (required when userType is DRIVER)
  vehicleType: z.string().min(2).max(50).optional(),
  licenseNumber: z.string().min(5).max(50).optional(),
  plateNumber: z.string().min(5).max(20).optional(),
}).refine(
  (data) => {
    // For drivers, password is required
    if (data.userType === UserType.DRIVER && !data.password) {
      return false;
    }
    return true;
  },
  {
    message: 'Password is required for driver registration',
    path: ['password'],
  }
).refine(
  (data) => {
    // For drivers, vehicle info is required
    if (
      data.userType === UserType.DRIVER &&
      (!data.vehicleType || !data.licenseNumber || !data.plateNumber)
    ) {
      return false;
    }
    return true;
  },
  {
    message: 'Vehicle type, license number, and plate number are required for driver registration',
    path: ['vehicleType'],
  }
);

/**
 * Login schema
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid Philippine phone number format')
    .transform((val) => {
      // Normalize to +639XXXXXXXXX format
      if (val.startsWith('09')) {
        return `+63${val.substring(1)}`;
      }
      if (val.startsWith('639')) {
        return `+${val}`;
      }
      return val;
    }),
  password: z.string().optional(),
  userType: z.nativeEnum(UserType).describe('User type must be CUSTOMER or DRIVER'),
});

/**
 * OTP verification schema
 */
export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid Philippine phone number format')
    .transform((val) => {
      // Normalize to +639XXXXXXXXX format
      if (val.startsWith('09')) {
        return `+63${val.substring(1)}`;
      }
      if (val.startsWith('639')) {
        return `+${val}`;
      }
      return val;
    }),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * OTP request schema - simplified for customer app
 */
export const otpRequestSchema = z.object({
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid Philippine phone number format')
    .transform((val) => {
      // Normalize to +639XXXXXXXXX format
      if (val.startsWith('09')) {
        return `+63${val.substring(1)}`;
      }
      if (val.startsWith('639')) {
        return `+${val}`;
      }
      return val;
    }),
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
});

/**
 * Type exports for controllers
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
