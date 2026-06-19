import { Router } from 'express';
import { certificateController } from './certificate.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/:enrollmentId', certificateController.getCertificate);

export default router;
