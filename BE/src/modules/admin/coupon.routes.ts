import express from 'express';
import { adminCouponController } from './coupon.controller';

const router = express.Router();

router.get('/', adminCouponController.getCoupons.bind(adminCouponController));
router.post('/', adminCouponController.createCoupon.bind(adminCouponController));
router.put('/:id/toggle', adminCouponController.toggleCoupon.bind(adminCouponController));

export default router;
