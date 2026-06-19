import { Request, Response, NextFunction } from 'express';
import { courseService } from './course.service';
import { sendSuccess, sendError } from '../../utils/response';

export class CourseController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const search = req.query.search as string;
      const level = req.query.level as string;

      const result = await courseService.getCourses({ page, limit, search, level });
      return sendSuccess(res, result, 'Lấy danh sách khóa học thành công');
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.getCourseById(req.params.id as string);
      if (!course) {
        return sendError(res, 'Không tìm thấy khóa học', 404);
      }
      return sendSuccess(res, course, 'Lấy chi tiết khóa học thành công');
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.createCourse(req.user!.userId, req.body);
      return sendSuccess(res, course, 'Tạo khóa học thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.updateCourse(req.params.id as string, req.user!.userId, req.body);
      return sendSuccess(res, course, 'Cập nhật khóa học thành công');
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.deleteCourse(req.params.id as string, req.user!.userId);
      return sendSuccess(res, null, 'Xóa khóa học thành công');
    } catch (error) {
      next(error);
    }
  }

  // --- SECTION ---

  async createSection(req: Request, res: Response, next: NextFunction) {
    try {
      const section = await courseService.createSection(req.params.courseId as string, req.user!.userId, req.body);
      return sendSuccess(res, section, 'Thêm section thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateSection(req: Request, res: Response, next: NextFunction) {
    try {
      const section = await courseService.updateSection(req.params.id as string, req.user!.userId, req.body);
      return sendSuccess(res, section, 'Cập nhật section thành công');
    } catch (error) {
      next(error);
    }
  }

  async deleteSection(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.deleteSection(req.params.id as string, req.user!.userId);
      return sendSuccess(res, null, 'Xóa section thành công');
    } catch (error) {
      next(error);
    }
  }

  // --- LESSON ---

  async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await courseService.createLesson(req.params.sectionId as string, req.user!.userId, req.body);
      return sendSuccess(res, lesson, 'Thêm bài học thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await courseService.updateLesson(req.params.id as string, req.user!.userId, req.body);
      return sendSuccess(res, lesson, 'Cập nhật bài học thành công');
    } catch (error) {
      next(error);
    }
  }

  async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.deleteLesson(req.params.id as string, req.user!.userId);
      return sendSuccess(res, null, 'Xóa bài học thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const courseController = new CourseController();
