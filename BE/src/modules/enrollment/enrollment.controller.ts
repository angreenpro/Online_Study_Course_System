import { Request, Response, NextFunction } from 'express';
import { enrollmentService } from './enrollment.service';
import { sendSuccess, sendError } from '../../utils/response';

export class EnrollmentController {
  async enroll(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await enrollmentService.enrollStudent(req.user!.userId, req.body.courseId);
      return sendSuccess(res, enrollment, 'Khởi tạo đăng ký thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollments = await enrollmentService.getMyEnrollments(req.user!.userId);
      return sendSuccess(res, enrollments, 'Lấy danh sách khóa học thành công');
    } catch (error) {
      next(error);
    }
  }

  async getEnrollmentDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await enrollmentService.getEnrollmentDetail(req.params.id as string, req.user!.userId);
      return sendSuccess(res, enrollment, 'Lấy chi tiết đăng ký thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const enrollmentController = new EnrollmentController();
