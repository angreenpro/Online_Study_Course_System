import { Router } from 'express';
import { instructorController } from './instructor.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole('INSTRUCTOR'));

router.get('/revenue', instructorController.getRevenueReport);
router.post('/courses/:id/announce', instructorController.announce);

export default router;
