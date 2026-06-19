import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validator';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register.bind(authController));

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login.bind(authController));

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), authController.refresh.bind(authController));

export default router;
