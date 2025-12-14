import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const orderController = new OrderController();

// Customer routes
router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);

// Admin routes
router.patch('/:id/status', authenticate, authorize('admin', 'store-manager', 'warehouse'), orderController.updateStatus);

export { router as orderRoutes };

