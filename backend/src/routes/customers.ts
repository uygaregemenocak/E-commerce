import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const customerController = new CustomerController();

// All customer routes require admin access
router.get('/', authenticate, authorize('admin', 'store-manager', 'support'), customerController.getAll);
router.get('/:id', authenticate, authorize('admin', 'store-manager', 'support'), customerController.getById);
router.post('/', authenticate, authorize('admin'), customerController.create);
router.patch('/:id', authenticate, authorize('admin', 'store-manager'), customerController.update);

export { router as customerRoutes };

