import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { sendSuccess } from '../../utils/response';
import { createError } from '../../middleware/errorHandler';

export class NotificationController {
  // Lấy danh sách thông báo của user
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw createError('Unauthorized', 401);

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      return sendSuccess(res, { notifications, unreadCount }, 'Lấy danh sách thông báo thành công');
    } catch (error) {
      next(error);
    }
  }

  // Đánh dấu 1 thông báo đã đọc
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.userId;
      if (!userId) throw createError('Unauthorized', 401);

      const notif = await prisma.notification.findUnique({ where: { id } });
      if (!notif || notif.userId !== userId) {
        throw createError('Không tìm thấy thông báo', 404);
      }

      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return sendSuccess(res, null, 'Đã đánh dấu đọc');
    } catch (error) {
      next(error);
    }
  }

  // Đánh dấu tất cả đã đọc
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw createError('Unauthorized', 401);

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return sendSuccess(res, null, 'Đã đánh dấu đọc tất cả');
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
