import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { sendSuccess, sendPaginated } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export class UserController {
  /**
   * GET /api/users/me
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getProfile(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/me
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, user, 'Cập nhật thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/users
   */
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const search = req.query.search as string | undefined;
      const { users, total } = await userService.getUsers(pagination, search);
      sendPaginated(res, users, total, pagination.page, pagination.limit);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/users/:id/roles
   */
  async updateUserRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await userService.updateUserRoles(id, req.body.roles);
      sendSuccess(res, user, 'Cập nhật vai trò thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/users/:id
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await userService.softDeleteUser(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
