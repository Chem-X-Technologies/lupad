import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  otpRequestSchema,
} from '../schemas/auth.schema.js';

const router: Router = Router();

// POST /api/auth/register - Register new user (sends OTP)
router.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register
);

// POST /api/auth/verify-otp - Verify OTP and complete registration
router.post(
  '/verify-otp',
  validate(verifyOtpSchema, 'body'),
  authController.verifyOtp
);

// POST /api/auth/login - Login (sends OTP for customers, requires password for drivers)
router.post(
  '/login',
  validate(loginSchema, 'body'),
  authController.login
);

// POST /api/auth/login-otp - Login with OTP (for customers after receiving OTP)
router.post(
  '/login-otp',
  validate(verifyOtpSchema, 'body'),
  authController.loginWithOtp
);

// POST /api/auth/refresh - Refresh access token
router.post(
  '/refresh',
  validate(refreshTokenSchema, 'body'),
  authController.refresh
);

// GET /api/auth/me - Get current user profile (requires authentication)
router.get('/me', authenticate, authController.me);

// POST /api/auth/logout - Logout (requires authentication)
router.post('/logout', authenticate, authController.logout);

// ============================================
// Simplified OTP flow for Customer App
// ============================================

// POST /api/auth/otp/request - Request OTP (for both new and existing users)
router.post(
  '/otp/request',
  validate(otpRequestSchema, 'body'),
  authController.requestOtpSimple
);

// POST /api/auth/otp/verify - Verify OTP and get tokens
router.post(
  '/otp/verify',
  validate(verifyOtpSchema, 'body'),
  authController.verifyOtpSimple
);

export default router;
