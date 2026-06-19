import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

export class AdminCouponController {
  async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return sendSuccess(res, coupons, 'Lấy danh sách mã giảm giá thành công');
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, discountType, discountValue, startDate, endDate, maxUsage } = req.body;
      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          discountType,
          discountValue,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          maxUsage
        }
      });
      return sendSuccess(res, coupon, 'Tạo mã giảm giá thành công', 201);
    } catch (error: any) {
      if (error.code === 'P2002') return next(createError('Mã giảm giá đã tồn tại', 400));
      next(error);
    }
  }

  async toggleCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { isActive } = req.body;
      const coupon = await prisma.coupon.update({
        where: { id },
        data: { isActive }
      });
      return sendSuccess(res, coupon, 'Cập nhật trạng thái thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const adminCouponController = new AdminCouponController();
