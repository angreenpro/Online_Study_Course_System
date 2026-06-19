import { Router } from 'express';
import { learningController } from './learning.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

// API Lấy nội dung học tập và tiến độ
router.get('/:courseId', learningController.getCourseContent);

// API Cập nhật tiến độ học tập
router.put('/progress', learningController.updateProgress);

// API nộp bài trắc nghiệm
router.post('/quiz/:lessonId/submit', learningController.submitQuiz);

export default router;
