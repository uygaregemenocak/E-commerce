import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin routes
router.post('/', authenticate, authorize('admin', 'store-manager'), productController.create);
router.patch('/:id', authenticate, authorize('admin', 'store-manager'), productController.update);
router.delete('/:id', authenticate, authorize('admin'), productController.delete);

export { router as productRoutes };

