import { z } from 'zod';

export const processPaymentSchema = z.object({
  paymentMethod: z.enum(['CREDIT_CARD', 'BANK_TRANSFER'], { required_error: 'Phương thức thanh toán không hợp lệ' }),
  couponCode: z.string().optional(),
});

export const validateCouponSchema = z.object({
  code: z.string({ required_error: 'Mã giảm giá là bắt buộc' }),
});
