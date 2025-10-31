import { Router } from 'express';
import { list, getBySlug, create, update, remove } from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { createProductRules } from '../validators/product.validators.js';

const router = Router();

// Public
router.get('/', list);
router.get('/:slug', getBySlug);

// Admin
router.post('/', protect, adminOnly, createProductRules, create);
router.put('/:id', protect, adminOnly, update);
router.delete('/:id', protect, adminOnly, remove);

export default router;
