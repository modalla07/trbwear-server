import { Router } from 'express';
import { createOrder, myOrders, listOrders, markPaid, markDelivered } from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, myOrders);

// Admin
router.get('/', protect, adminOnly, listOrders);
router.patch('/:id/paid', protect, adminOnly, markPaid);
router.patch('/:id/delivered', protect, adminOnly, markDelivered);

export default router;
