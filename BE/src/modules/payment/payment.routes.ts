import express from 'express';
import { paymentController } from './payment.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { processPaymentSchema, validateCouponSchema } from './payment.validator';

const router = express.Router();

router.use(requireAuth);

router.post('/coupons/validate', validate(validateCouponSchema), paymentController.validateCoupon.bind(paymentController));
router.post('/:id/process', validate(processPaymentSchema), paymentController.processPayment.bind(paymentController));

export default router;
