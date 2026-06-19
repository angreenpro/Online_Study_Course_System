import { Router } from 'express';
import { userController } from '../user/user.controller';
import couponRoutes from './coupon.routes';
import { adminController } from './admin.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import { updateUserRolesSchema } from '../user/user.validator';

const router = Router();

// Tất cả admin routes đều yêu cầu auth + role ADMIN
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

// Mount routes
router.use('/coupons', couponRoutes);

// GET /api/admin/dashboard - Thống kê tổng quan
router.get('/dashboard', adminController.getDashboardStats);

// GET /api/admin/revenue - Báo cáo doanh thu
router.get('/revenue', adminController.getRevenueReport);

// GET /api/admin/users - Danh sách users
router.get('/users', userController.getUsers.bind(userController));

// PUT /api/admin/users/:id/roles - Gán roles
router.put(
  '/users/:id/roles',
  validate(updateUserRolesSchema),
  userController.updateUserRoles.bind(userController)
);

// DELETE /api/admin/users/:id - Soft delete user
router.delete('/users/:id', userController.deleteUser.bind(userController));

export default router;
