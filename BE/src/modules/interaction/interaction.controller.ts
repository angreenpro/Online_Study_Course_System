import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

export class InteractionController {
  // ==========================================
  // NOTES
  // ==========================================
  async getNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = req.params.lessonId as string;
      const userId = req.user?.userId;

      const notes = await prisma.note.findMany({
        where: {
          lessonId,
          studentId: userId,
        },
        orderBy: { videoTimestamp: 'asc' },
      });

      return sendSuccess(res, notes, 'Lấy danh sách ghi chú thành công');
    } catch (error) {
      next(error);
    }
  }

  async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, videoTimestamp } = req.body;
      const lessonId = req.body.lessonId as string;
      const userId = req.user?.userId;

      if (!userId) throw createError('Unauthorized', 401);

      const note = await prisma.note.create({
        data: {
          studentId: userId,
          lessonId,
          content,
          videoTimestamp: videoTimestamp || 0,
        },
      });

      return sendSuccess(res, note, 'Tạo ghi chú thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.userId;

      const note = await prisma.note.findUnique({ where: { id } });
      if (!note) throw createError('Ghi chú không tồn tại', 404);
      if (note.studentId !== userId) throw createError('Không có quyền xóa ghi chú này', 403);

      await prisma.note.delete({ where: { id } });
      return sendSuccess(res, null, 'Xóa ghi chú thành công');
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // DISCUSSIONS
  // ==========================================
  async getDiscussions(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = req.params.lessonId as string;

      const discussions = await prisma.discussion.findMany({
        where: {
          lessonId,
          parentId: null,
          deletedAt: null,
        },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
          replies: {
            where: { deletedAt: null },
            include: {
              user: {
                select: { id: true, fullName: true, avatarUrl: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, discussions, 'Lấy danh sách thảo luận thành công');
    } catch (error) {
      next(error);
    }
  }

  async createDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, parentId } = req.body;
      const lessonId = req.body.lessonId as string;
      const userId = req.user?.userId;

      if (!userId) throw createError('Unauthorized', 401);

      const discussion = await prisma.discussion.create({
        data: {
          userId,
          lessonId,
          content,
          parentId,
        },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
        },
      });

      return sendSuccess(res, discussion, 'Tạo thảo luận thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteDiscussion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.userId;

      const currentUserRoles = await prisma.userRole.findMany({ where: { userId } });
      const isAdmin = currentUserRoles.some(r => r.role === 'ADMIN');

      const discussion = await prisma.discussion.findUnique({ where: { id } });
      if (!discussion) throw createError('Thảo luận không tồn tại', 404);
      if (discussion.userId !== userId && !isAdmin) {
        throw createError('Không có quyền xóa thảo luận này', 403);
      }

      await prisma.discussion.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return sendSuccess(res, null, 'Xóa thảo luận thành công');
    } catch (error) {
      next(error);
    }
  }
}

export const interactionController = new InteractionController();
