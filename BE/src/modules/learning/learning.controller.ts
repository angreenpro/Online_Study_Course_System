import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

export class LearningController {
  // Lấy nội dung khóa học (chỉ dành cho học viên đã đăng ký)
  async getCourseContent(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId as string;
      const userId = req.user?.userId;

      if (!userId) {
        throw createError('Unauthorized', 401);
      }

      // Kiểm tra đăng ký
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: userId,
            courseId: courseId,
          },
        },
      });

      if (!enrollment || enrollment.status !== 'ACTIVE') {
        throw createError('Bạn chưa đăng ký khóa học này hoặc trạng thái không hợp lệ', 403);
      }

      // Lấy nội dung khóa học
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              lessons: {
                orderBy: { order: 'asc' },
                include: {
                  quizQuestions: {
                    orderBy: { order: 'asc' },
                    include: {
                      choices: {
                        select: {
                          id: true,
                          choiceText: true,
                        }
                      }
                    }
                  }
                }
              },
            },
          },
        },
      });

      if (!course) {
        throw createError('Không tìm thấy khóa học', 404);
      }

      // Lấy tiến độ học tập
      const progresses = await prisma.progress.findMany({
        where: { enrollmentId: enrollment.id },
      });

      return sendSuccess(res, { course, progresses, enrollmentId: enrollment.id }, 'Lấy nội dung học tập thành công');
    } catch (error) {
      next(error);
    }
  }

  // Cập nhật tiến độ học tập
  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { enrollmentId, status } = req.body;
      const lessonId = req.body.lessonId as string;
      const userId = req.user?.userId;

      if (!userId) {
        throw createError('Unauthorized', 401);
      }

      // Verify enrollment belongs to user
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
      });

      if (!enrollment || enrollment.studentId !== userId) {
        throw createError('Unauthorized access to enrollment', 403);
      }

      // Cập nhật hoặc tạo mới progress
      const progress = await prisma.progress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId,
            lessonId,
          },
        },
        update: {
          status,
        },
        create: {
          enrollmentId,
          lessonId,
          status,
        },
      });

      return sendSuccess(res, progress, 'Cập nhật tiến độ thành công');
    } catch (error) {
      next(error);
    }
  }

  // Nộp bài trắc nghiệm
  async submitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = req.params.lessonId as string;
      const { answers } = req.body; // { [questionId: string]: choiceId }
      const userId = req.user?.userId;

      if (!userId) {
        throw createError('Unauthorized', 401);
      }

      // Load all questions for this lesson to grade
      const questions = await prisma.quizQuestion.findMany({
        where: { lessonId },
        include: { choices: true }
      });

      if (!questions.length) {
        throw createError('Không tìm thấy câu hỏi cho bài học này', 404);
      }

      let correctCount = 0;
      for (const question of questions) {
        const selectedChoiceId = answers[question.id];
        const correctChoice = question.choices.find(c => c.isCorrect);
        
        if (correctChoice && selectedChoiceId === correctChoice.id) {
          correctCount++;
        }
      }

      const score = (correctCount / questions.length) * 100;
      const isPassed = score >= 80; // Pass mark 80%

      // Save result
      const result = await prisma.quizResult.create({
        data: {
          studentId: userId,
          lessonId,
          score,
          isPassed,
        }
      });

      // Update progress if passed
      if (isPassed) {
        // Find enrollment
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { section: { include: { course: true } } }
        });

        if (lesson) {
          const enrollment = await prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId: userId, courseId: lesson.section.courseId } }
          });

          if (enrollment) {
            await prisma.progress.upsert({
              where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
              update: { status: 'COMPLETED' },
              create: { enrollmentId: enrollment.id, lessonId, status: 'COMPLETED' }
            });
          }
        }
      }

      return sendSuccess(res, result, 'Nộp bài trắc nghiệm thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const learningController = new LearningController();
