import { Router } from 'express';
import { reviewController } from './review.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

// Lấy đánh giá khóa học (Public)
router.get('/course/:courseId', reviewController.getCourseReviews);

// Đăng đánh giá (Require Auth)
router.post('/', requireAuth, reviewController.createReview);

export default router;
