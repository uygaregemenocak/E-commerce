import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();
const cartController = new CartController();

router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, cartController.addItem);
router.patch('/items/:itemId', optionalAuth, cartController.updateItem);
router.delete('/items/:itemId', optionalAuth, cartController.removeItem);
router.delete('/', authenticate, cartController.clearCart);

export { router as cartRoutes };

