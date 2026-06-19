import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service';
import { sendSuccess } from '../../utils/response';

export class PaymentController {
  async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await paymentService.validateCoupon(req.body.code);
      return sendSuccess(res, coupon, 'Mã giảm giá hợp lệ');
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.processPayment(req.params.id as string, req.user!.userId, req.body);
      return sendSuccess(res, payment, 'Thanh toán thành công', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
