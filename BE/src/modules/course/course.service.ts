import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import {
  createCourseSchema,
  updateCourseSchema,
  createSectionSchema,
  updateSectionSchema,
  createLessonSchema,
  updateLessonSchema,
} from './course.validator';

// Infer proper types from Zod schemas instead of using `any`
type CreateCourseInput = z.infer<typeof createCourseSchema>;
type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
type CreateSectionInput = z.infer<typeof createSectionSchema>;
type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
type CreateLessonInput = z.infer<typeof createLessonSchema>;
type UpdateLessonInput = z.infer<typeof updateLessonSchema>;

export class CourseService {
  /**
   * Lấy danh sách khóa học có phân trang và lọc
   */
  async getCourses(params: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
      ...(params.search && {
        title: { contains: params.search },
      }),
      ...(params.level && {
        level: params.level,
      }),
    };

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
          _count: { select: { sections: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy chi tiết khóa học bao gồm sections và lessons
   */
  async getCourseById(id: string) {
    return prisma.course.findUnique({
      where: { id, deletedAt: null },
      include: {
        instructor: {
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async createCourse(instructorId: string, data: CreateCourseInput) {
    return prisma.course.create({
      data: {
        ...data,
        instructorId,
      },
    });
  }

  async updateCourse(id: string, instructorId: string, data: UpdateCourseInput) {
    // Ensure course exists and belongs to instructor
    const course = await prisma.course.findFirst({
      where: { id, instructorId, deletedAt: null },
    });

    if (!course) throw createError('Khóa học không tồn tại hoặc bạn không có quyền sửa', 404);

    return prisma.course.update({
      where: { id },
      data,
    });
  }

  async deleteCourse(id: string, instructorId: string) {
    const course = await prisma.course.findFirst({
      where: { id, instructorId, deletedAt: null },
    });

    if (!course) throw createError('Khóa học không tồn tại hoặc bạn không có quyền xóa', 404);

    // Soft delete
    return prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // --- SECTION ---

  async createSection(courseId: string, instructorId: string, data: CreateSectionInput) {
    // Verify ownership
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId, deletedAt: null },
    });
    if (!course) throw createError('Khóa học không tồn tại hoặc bạn không có quyền thao tác', 403);

    return prisma.section.create({
      data: {
        ...data,
        courseId,
      },
    });
  }

  async updateSection(id: string, instructorId: string, data: UpdateSectionInput) {
    const section = await prisma.section.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!section || section.course.instructorId !== instructorId) {
      throw createError('Section không tồn tại hoặc bạn không có quyền sửa', 404);
    }

    return prisma.section.update({
      where: { id },
      data,
    });
  }

  async deleteSection(id: string, instructorId: string) {
    const section = await prisma.section.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!section || section.course.instructorId !== instructorId) {
      throw createError('Section không tồn tại hoặc bạn không có quyền xóa', 404);
    }

    return prisma.section.delete({
      where: { id },
    });
  }

  // --- LESSON ---

  async createLesson(sectionId: string, instructorId: string, data: CreateLessonInput) {
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section || section.course.instructorId !== instructorId) {
      throw createError('Section không tồn tại hoặc bạn không có quyền thao tác', 403);
    }

    return prisma.lesson.create({
      data: {
        ...data,
        sectionId,
      },
    });
  }

  async updateLesson(id: string, instructorId: string, data: UpdateLessonInput) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { section: { include: { course: true } } },
    });

    if (!lesson || lesson.section.course.instructorId !== instructorId) {
      throw createError('Bài học không tồn tại hoặc bạn không có quyền sửa', 404);
    }

    return prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async deleteLesson(id: string, instructorId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { section: { include: { course: true } } },
    });

    if (!lesson || lesson.section.course.instructorId !== instructorId) {
      throw createError('Bài học không tồn tại hoặc bạn không có quyền xóa', 404);
    }

    return prisma.lesson.delete({
      where: { id },
    });
  }
}

export const courseService = new CourseService();
