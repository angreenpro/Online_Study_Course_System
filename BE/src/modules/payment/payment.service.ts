import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';

export class PaymentService {
  async validateCoupon(code: string) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw createError('Mã giảm giá không tồn tại', 404);
    if (!coupon.isActive) throw createError('Mã giảm giá đã bị khóa', 400);
    
    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw createError('Mã giảm giá đã hết hạn hoặc chưa có hiệu lực', 400);
    }

    if (coupon.currentUsage >= coupon.maxUsage) {
      throw createError('Mã giảm giá đã hết lượt sử dụng', 400);
    }

    return coupon;
  }

  async processPayment(enrollmentId: string, studentId: string, data: { paymentMethod: string, couponCode?: string }) {
    // 1. Validate Enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true, payment: true }
    });

    if (!enrollment) throw createError('Khóa học chưa được đăng ký (Enrollment không tồn tại)', 404);
    if (enrollment.studentId !== studentId) throw createError('Không có quyền thanh toán', 403);
    if (enrollment.status === 'ACTIVE' || enrollment.status === 'COMPLETED') {
      throw createError('Khóa học này đã được thanh toán', 409);
    }

    const originalPrice = enrollment.course.price;
    let finalPrice = originalPrice;
    let couponId = null;

    // 2. Validate & Apply Coupon
    if (data.couponCode) {
      const coupon = await this.validateCoupon(data.couponCode);
      couponId = coupon.id;
      if (coupon.discountType === 'PERCENTAGE') {
        finalPrice = originalPrice * (1 - coupon.discountValue / 100);
      } else if (coupon.discountType === 'FIXED_AMOUNT') {
        finalPrice = Math.max(0, originalPrice - coupon.discountValue);
      }
    }

    // 3. Process Transaction (MOCK)
    // In reality, we'd call Stripe/VNPay here and wait for webhook.
    // For this Mock, we assume payment is instantly successful.
    
    return await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          enrollmentId,
          couponId,
          originalPrice,
          finalPrice,
          paymentMethod: data.paymentMethod,
          status: 'COMPLETED',
          paidAt: new Date(),
          transactionId: `MOCK_TX_${Date.now()}`
        }
      });

      // Update enrollment status
      await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { status: 'ACTIVE' }
      });

      // Update coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { currentUsage: { increment: 1 } }
        });
      }

      return payment;
    });
  }
}

export const paymentService = new PaymentService();
