import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

export class ReviewController {
  // Tạo đánh giá cho khóa học đã hoàn thành/đang học
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId, rating, comment } = req.body;
      const userId = req.user?.userId;

      if (!userId) throw createError('Unauthorized', 401);

      // Kiểm tra enrollment thuộc về user
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: { review: true }
      });

      if (!enrollment || enrollment.studentId !== userId) {
        throw createError('Không có quyền đánh giá khóa học này', 403);
      }

      if (enrollment.review) {
        throw createError('Bạn đã đánh giá khóa học này rồi', 400);
      }

      const review = await prisma.review.create({
        data: {
          enrollmentId,
          rating,
          comment
        }
      });

      return sendSuccess(res, review, 'Gửi đánh giá thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  // Lấy đánh giá của một khóa học
  async getCourseReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId as string;

      const reviews = await prisma.review.findMany({
        where: {
          enrollment: {
            courseId
          }
        },
        include: {
          enrollment: {
            include: {
              student: {
                select: { id: true, fullName: true, avatarUrl: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Format response để trả về thông tin student dễ dùng hơn
      const formattedReviews = reviews.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        student: r.enrollment.student
      }));

      return sendSuccess(res, formattedReviews, 'Lấy danh sách đánh giá thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
