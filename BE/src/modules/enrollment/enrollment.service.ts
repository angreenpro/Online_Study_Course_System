import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';

export class EnrollmentService {
  async enrollStudent(studentId: string, courseId: string) {
    // 1. Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw createError('Khóa học không tồn tại', 404);

    // 2. Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });

    if (existing) {
      if (existing.status === 'COMPLETED' || existing.status === 'ACTIVE') {
        throw createError('Bạn đã đăng ký khóa học này rồi', 409);
      }
      return existing; // Return existing pending enrollment
    }

    // 3. Create pending enrollment
    return await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'PENDING',
      },
    });
  }

  async getMyEnrollments(studentId: string) {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            instructor: { select: { fullName: true } }
          }
        },
        payment: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getEnrollmentDetail(id: string, studentId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            sections: {
              include: { lessons: { orderBy: { order: 'asc' } } },
              orderBy: { order: 'asc' },
            }
          }
        },
        payment: true,
      },
    });

    if (!enrollment) throw createError('Không tìm thấy thông tin đăng ký', 404);
    if (enrollment.studentId !== studentId) throw createError('Không có quyền truy cập', 403);

    return enrollment;
  }
}

export const enrollmentService = new EnrollmentService();
