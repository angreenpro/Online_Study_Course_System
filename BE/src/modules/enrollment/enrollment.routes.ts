import express from 'express';
import { enrollmentController } from './enrollment.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { enrollSchema } from './enrollment.validator';

const router = express.Router();

router.use(requireAuth);

router.post('/', validate(enrollSchema), enrollmentController.enroll.bind(enrollmentController));
router.get('/my', enrollmentController.getMyEnrollments.bind(enrollmentController));
router.get('/:id', enrollmentController.getEnrollmentDetail.bind(enrollmentController));

export default router;
