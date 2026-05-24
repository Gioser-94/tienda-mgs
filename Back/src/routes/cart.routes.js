import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getCarrito, addItemCarrito, updateItemCarrito, deleteItemCarrito, clearCarrito } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', requireAuth, getCarrito);
router.post('/items', requireAuth, addItemCarrito);
router.put('/items/:productId', requireAuth, updateItemCarrito);
router.delete('/items/:productId', requireAuth, deleteItemCarrito);
router.delete('/', requireAuth, clearCarrito);

export default router;