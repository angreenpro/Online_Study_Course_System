import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import { updateProfileSchema, updateUserRolesSchema } from './user.validator';

const router = Router();

// ========== User Profile Routes ==========

// GET /api/users/me - Lấy profile hiện tại
router.get('/me', authMiddleware, userController.getProfile.bind(userController));

// PUT /api/users/me - Cập nhật profile
router.put(
  '/me',
  authMiddleware,
  validate(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

export default router;
