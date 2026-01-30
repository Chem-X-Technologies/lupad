import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import driversRoutes from './drivers.routes.js';
// import ridesRoutes from './rides.routes.js';

const router: Router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/drivers', driversRoutes);
// router.use('/rides', ridesRoutes);

export default router;
