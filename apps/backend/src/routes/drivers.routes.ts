import { Router } from 'express';
import * as driversController from '../controllers/drivers.controller.js';
import { authenticate, requireDriver } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateDriverSchema,
  updateVehicleSchema,
  updateAvailabilitySchema,
  getDriverParamsSchema,
} from '../schemas/drivers.schema.js';

const router: Router = Router();

// GET /api/drivers/me - Get current driver profile
router.get('/me', authenticate, requireDriver, driversController.getMe);

// PUT /api/drivers/me - Update current driver profile
router.put(
  '/me',
  authenticate,
  requireDriver,
  validate(updateDriverSchema, 'body'),
  driversController.updateMe
);

// PUT /api/drivers/me/vehicle - Update vehicle information
router.put(
  '/me/vehicle',
  authenticate,
  requireDriver,
  validate(updateVehicleSchema, 'body'),
  driversController.updateVehicle
);

// PUT /api/drivers/me/status - Update availability status (online/offline)
router.put(
  '/me/status',
  authenticate,
  requireDriver,
  validate(updateAvailabilitySchema, 'body'),
  driversController.updateAvailability
);

// GET /api/drivers/me/stats - Get driver statistics
router.get('/me/stats', authenticate, requireDriver, driversController.getStats);

// GET /api/drivers/:id - Get driver by ID (public profile)
router.get(
  '/:id',
  authenticate,
  validate(getDriverParamsSchema, 'params'),
  driversController.getDriverById
);

export default router;
