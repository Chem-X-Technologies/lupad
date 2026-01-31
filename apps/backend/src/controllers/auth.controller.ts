import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { redisHelpers } from '../lib/redis.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateTokenPair, verifyRefreshToken, TokenPayload } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserType, AuthMethod } from '@prisma/client';
import type { RegisterInput, LoginInput, VerifyOtpInput, RefreshTokenInput, OtpRequestInput } from '../schemas/auth.schema.js';

/**
 * Generate a 6-digit OTP
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS (mock implementation for now)
 * TODO: Integrate with Twilio in production
 */
const sendOtp = async (phone: string, otp: string): Promise<void> => {
  // For development, just log to console
  console.log(`📱 SMS to ${phone}: Your Lupad verification code is: ${otp}`);
  // TODO: Implement Twilio integration
  // await twilioClient.messages.create({
  //   body: `Your Lupad verification code is: ${otp}`,
  //   to: phone,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  // });
};

/**
 * Register a new user
 */
export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, name, email, userType, password, vehicleType, licenseNumber, plateNumber } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new AppError(400, 'Phone number already registered');
    }

    // Generate OTP for phone verification
    const otp = generateOtp();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in Redis
    await redisHelpers.set(
      `otp:${phone}`,
      JSON.stringify({ otp, expiry: otpExpiry }),
      300 // 5 minutes TTL
    );

    // Send OTP
    await sendOtp(phone, otp);

    // For customers: create user immediately (no password)
    // For drivers: store registration data temporarily until OTP verification
    if (userType === UserType.CUSTOMER) {
      // Store temporary registration data
      await redisHelpers.set(
        `registration:${phone}`,
        JSON.stringify({ phone, name, email, userType, authMethod: AuthMethod.OTP }),
        600 // 10 minutes TTL
      );
    } else {
      // For drivers, hash password and store registration data
      if (!password) {
        throw new AppError(400, 'Password is required for driver registration');
      }

      const hashedPassword = await hashPassword(password);

      await redisHelpers.set(
        `registration:${phone}`,
        JSON.stringify({
          phone,
          name,
          email,
          userType,
          password: hashedPassword,
          authMethod: AuthMethod.PASSWORD,
          vehicleType,
          licenseNumber,
          plateNumber,
        }),
        600 // 10 minutes TTL
      );
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number. Please verify to complete registration.',
      data: {
        phone,
        otpSent: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP and complete registration
 */
export const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    // Get OTP from Redis
    const otpData = await redisHelpers.get(`otp:${phone}`);

    if (!otpData) {
      throw new AppError(400, 'OTP expired or invalid');
    }

    const { otp: storedOtp, expiry } = JSON.parse(otpData as string);

    // Check if OTP is expired
    if (Date.now() > expiry) {
      await redisHelpers.del(`otp:${phone}`);
      throw new AppError(400, 'OTP expired');
    }

    // Verify OTP
    if (otp !== storedOtp) {
      throw new AppError(400, 'Invalid OTP');
    }

    // Get registration data
    const registrationData = await redisHelpers.get(`registration:${phone}`);

    if (!registrationData) {
      throw new AppError(400, 'Registration data not found. Please register again.');
    }

    const userData = JSON.parse(registrationData as string);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        phone: userData.phone,
        name: userData.name,
        email: userData.email || null,
        userType: userData.userType,
        password: userData.password || null,
        authMethod: userData.authMethod,
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        userType: true,
        authMethod: true,
        createdAt: true,
      },
    });

    // If driver, create driver profile
    if (userData.userType === UserType.DRIVER) {
      await prisma.driver.create({
        data: {
          userId: user.id,
          vehicleType: userData.vehicleType,
          licenseNumber: userData.licenseNumber,
          plateNumber: userData.plateNumber,
        },
      });
    }

    // Clean up Redis
    await redisHelpers.del(`otp:${phone}`);
    await redisHelpers.del(`registration:${phone}`);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      userType: user.userType as 'CUSTOMER' | 'DRIVER',
      phone: user.phone,
      authMethod: user.authMethod as 'OTP' | 'PASSWORD',
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login
 */
export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, password, userType } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        userType: true,
        password: true,
        authMethod: true,
      },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check if user type matches
    if (user.userType !== userType) {
      throw new AppError(401, 'Invalid credentials');
    }

    // For customers (passwordless OTP)
    if (user.userType === UserType.CUSTOMER) {
      // Generate OTP
      const otp = generateOtp();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

      // Store OTP in Redis
      await redisHelpers.set(
        `otp:${phone}`,
        JSON.stringify({ otp, expiry: otpExpiry, userId: user.id }),
        300
      );

      // Send OTP
      await sendOtp(phone, otp);

      res.status(200).json({
        success: true,
        message: 'OTP sent to your phone number',
        data: {
          phone,
          otpSent: true,
          requiresOtp: true,
        },
      });
      return;
    }

    // For drivers (password-based)
    if (user.userType === UserType.DRIVER) {
      if (!password) {
        throw new AppError(400, 'Password is required');
      }

      if (!user.password) {
        throw new AppError(401, 'Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new AppError(401, 'Invalid credentials');
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        userType: user.userType as 'CUSTOMER' | 'DRIVER',
        phone: user.phone,
        authMethod: user.authMethod as 'OTP' | 'PASSWORD',
      };

      const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email,
            userType: user.userType,
            authMethod: user.authMethod,
          },
          accessToken,
          refreshToken,
        },
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Login with OTP (for customers after receiving OTP)
 */
export const loginWithOtp = async (
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    // Get OTP from Redis
    const otpData = await redisHelpers.get(`otp:${phone}`);

    if (!otpData) {
      throw new AppError(400, 'OTP expired or invalid');
    }

    const { otp: storedOtp, expiry, userId } = JSON.parse(otpData as string);

    // Check if OTP is expired
    if (Date.now() > expiry) {
      await redisHelpers.del(`otp:${phone}`);
      throw new AppError(400, 'OTP expired');
    }

    // Verify OTP
    if (otp !== storedOtp) {
      throw new AppError(400, 'Invalid OTP');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        userType: true,
        authMethod: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Clean up OTP
    await redisHelpers.del(`otp:${phone}`);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      userType: user.userType as 'CUSTOMER' | 'DRIVER',
      phone: user.phone,
      authMethod: user.authMethod as 'OTP' | 'PASSWORD',
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const me = async (
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
 * Refresh access token
 */
export const refresh = async (
  req: Request<{}, {}, RefreshTokenInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

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

    // Generate new token pair
    const tokenPayload: TokenPayload = {
      userId: user.id,
      userType: user.userType as 'CUSTOMER' | 'DRIVER',
      phone: user.phone,
      authMethod: user.authMethod as 'OTP' | 'PASSWORD',
    };

    const tokens = generateTokenPair(tokenPayload);

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (client-side token removal, optionally blacklist token)
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement token blacklisting if needed
    // For now, just return success (client will remove tokens)

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request OTP - Simplified flow for customer app
 * Handles both new and existing users
 */
export const requestOtpSimple = async (
  req: Request<{}, {}, OtpRequestInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
      select: { id: true },
    });

    // Generate OTP
    const otp = generateOtp();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in Redis with user existence flag
    await redisHelpers.set(
      `otp:${phone}`,
      JSON.stringify({
        otp,
        expiry: otpExpiry,
        isNewUser: !existingUser,
        userId: existingUser?.id || null,
      }),
      300 // 5 minutes TTL
    );

    // Send OTP
    await sendOtp(phone, otp);

    // Calculate expiry time for response
    const expiresAt = new Date(otpExpiry).toISOString();

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        message: 'OTP sent to your phone number',
        expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP - Simplified flow for customer app
 * Creates user if new, returns tokens for both cases
 */
export const verifyOtpSimple = async (
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    // Get OTP data from Redis
    const otpData = await redisHelpers.get(`otp:${phone}`);

    if (!otpData) {
      throw new AppError(400, 'OTP expired or invalid');
    }

    const { otp: storedOtp, expiry, isNewUser, userId } = JSON.parse(otpData as string);

    // Check if OTP is expired
    if (Date.now() > expiry) {
      await redisHelpers.del(`otp:${phone}`);
      throw new AppError(400, 'OTP expired');
    }

    // Verify OTP
    if (otp !== storedOtp) {
      throw new AppError(400, 'Invalid OTP');
    }

    let user;

    if (isNewUser) {
      // Create new user with empty name (will be set during onboarding)
      user = await prisma.user.create({
        data: {
          phone,
          name: '',
          userType: UserType.CUSTOMER,
          authMethod: AuthMethod.OTP,
        },
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          userType: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // Get existing user
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          phone: true,
          name: true,
          email: true,
          userType: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }
    }

    // Clean up OTP
    await redisHelpers.del(`otp:${phone}`);

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      userType: user.userType as 'CUSTOMER' | 'DRIVER',
      phone: user.phone,
      authMethod: 'OTP',
    };

    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

    // Map response to match frontend expectations
    res.status(200).json({
      success: true,
      message: isNewUser ? 'Registration successful' : 'Login successful',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          role: user.userType, // Map userType to role for frontend
          isVerified: true,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
