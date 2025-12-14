import { Router } from 'express';
import { ReturnController } from '../controllers/returnController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const returnController = new ReturnController();

// Customer routes
router.get('/', authenticate, returnController.getReturns);
router.get('/:id', authenticate, returnController.getReturnById);
router.post('/', authenticate, returnController.createReturn);

// Admin routes
router.patch('/:id', authenticate, authorize('admin', 'store-manager', 'support'), returnController.updateReturn);

export { router as returnRoutes };

