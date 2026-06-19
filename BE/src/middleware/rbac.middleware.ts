import { Request, Response, NextFunction } from 'express';
import type { Role } from '../config/constants';
import { prisma } from '../config/database';
import { sendError } from '../utils/response';

/**
 * RBAC Middleware - Kiểm tra user có role phù hợp không
 * Sử dụng bảng UserRole để hỗ trợ đa vai trò
 */
export function requireRole(...allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    try {
      const userRoles = await prisma.userRole.findMany({
        where: { userId: req.user.userId },
        select: { role: true },
      });

      const roles = userRoles.map((ur) => ur.role);
      const hasPermission = allowedRoles.some((role) => roles.includes(role));

      if (!hasPermission) {
        sendError(res, 'Insufficient permissions', 403);
        return;
      }

      next();
    } catch (error) {
      sendError(res, 'Authorization check failed', 500);
      return;
    }
  };
}
