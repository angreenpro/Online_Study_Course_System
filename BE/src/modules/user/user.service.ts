import type { Role } from '../../config/constants';
import { prisma } from '../../config/database';
import { createError } from '../../middleware/errorHandler';
import { UpdateProfileInput } from './user.validator';
import { PaginationParams } from '../../utils/pagination';

export class UserService {
  /**
   * Lấy thông tin profile theo userId
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        roles: { select: { role: true, assignedAt: true } },
      },
    });

    if (!user) {
      throw createError('Không tìm thấy người dùng', 404);
    }

    return {
      ...user,
      roles: user.roles.map((r) => r.role),
    };
  }

  /**
   * Cập nhật profile
   */
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw createError('Không tìm thấy người dùng', 404);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        roles: { select: { role: true } },
      },
    });

    return {
      ...updated,
      roles: updated.roles.map((r) => r.role),
    };
  }

  /**
   * [ADMIN] Danh sách users có phân trang
   */
  async getUsers(pagination: PaginationParams, search?: string) {
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
          roles: { select: { role: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({
        ...u,
        roles: u.roles.map((r) => r.role),
      })),
      total,
    };
  }

  /**
   * [ADMIN] Gán roles cho user (thay thế toàn bộ)
   */
  async updateUserRoles(userId: string, roles: Role[]) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw createError('Không tìm thấy người dùng', 404);
    }

    // Xóa hết roles cũ rồi tạo mới (transaction)
    await prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId } }),
      ...roles.map((role) =>
        prisma.userRole.create({
          data: { userId, role },
        })
      ),
    ]);

    return this.getProfile(userId);
  }

  /**
   * [ADMIN] Soft delete user
   */
  async softDeleteUser(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw createError('Không tìm thấy người dùng', 404);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Đã xóa người dùng' };
  }
}

export const userService = new UserService();
