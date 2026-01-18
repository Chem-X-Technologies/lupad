import { Router } from 'express';
import authRoutes from './auth.routes.js';
// import userRoutes from './user.routes.js';
// import rideRoutes from './ride.routes.js';
// import driverRoutes from './driver.routes.js';

const router: Router = Router();

// Mount all routes
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/rides', rideRoutes);
// router.use('/drivers', driverRoutes);

export default router;
