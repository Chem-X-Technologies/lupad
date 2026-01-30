import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema, getUserParamsSchema } from '../schemas/users.schema.js';

const router: Router = Router();

// GET /api/users/me - Get current user profile
router.get('/me', authenticate, usersController.getMe);

// PUT /api/users/me - Update current user profile
router.put(
  '/me',
  authenticate,
  validate(updateUserSchema, 'body'),
  usersController.updateMe
);

// DELETE /api/users/me - Delete current user account
router.delete('/me', authenticate, usersController.deleteMe);

// GET /api/users/:id - Get user by ID (public profile - limited info)
router.get(
  '/:id',
  authenticate,
  validate(getUserParamsSchema, 'params'),
  usersController.getUserById
);

export default router;
