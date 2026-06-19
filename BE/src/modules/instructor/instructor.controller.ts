import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

export class InstructorController {
  // Báo cáo doanh thu cho Instructor
  async getRevenueReport(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorId = req.user?.userId;
      if (!instructorId) throw createError('Unauthorized', 401);

      // Giả lập: Lấy tất cả khóa học của instructor, sau đó lấy enrollment và payment
      const courses = await prisma.course.findMany({
        where: { instructorId },
        select: { id: true, title: true }
      });

      const courseIds = courses.map(c => c.id);

      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: { in: courseIds }, status: 'ACTIVE' },
        include: { payment: true }
      });

      let totalRevenue = 0;
      for (const en of enrollments) {
        if (en.payment && en.payment.status === 'COMPLETED') {
          // Trừ % phí sàn (giả sử 30%)
          totalRevenue += en.payment.finalPrice * 0.7; 
        }
      }

      return sendSuccess(res, { totalRevenue, totalEnrollments: enrollments.length }, 'Lấy doanh thu thành công');
    } catch (error) {
      next(error);
    }
  }

  // Gửi thông báo đến toàn bộ học viên của khóa học (Announcement)
  async announce(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string; // courseId
      const { title, content } = req.body;
      const instructorId = req.user?.userId;

      if (!instructorId) throw createError('Unauthorized', 401);

      const course = await prisma.course.findUnique({
        where: { id },
        include: { enrollments: true }
      });

      if (!course || course.instructorId !== instructorId) {
        throw createError('Không có quyền thao tác trên khóa học này', 403);
      }

      // Tạo thông báo cho từng học viên
      const notifications = course.enrollments.map(en => ({
        userId: en.studentId,
        type: 'ANNOUNCEMENT',
        title: `[${course.title}] ${title}`,
        content,
        relatedId: course.id,
      }));

      await prisma.notification.createMany({
        data: notifications
      });

      return sendSuccess(res, null, 'Gửi thông báo thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const instructorController = new InstructorController();
