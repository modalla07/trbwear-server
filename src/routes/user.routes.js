import { Router } from 'express';
import { register, login, me, listUsers } from '../controllers/user.controller.js';
import { registerRules } from '../validators/user.validators.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerRules, register);
router.post('/login', login);
router.get('/me', protect, me);
router.get('/', protect, adminOnly, listUsers);

export default router;
