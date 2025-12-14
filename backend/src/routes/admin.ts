import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

// All routes require auth and admin/manager role
router.use(authenticate, authorize('admin', 'store-manager'));

router.get('/dashboard', adminController.getDashboardStats);

export { router as adminRoutes };
