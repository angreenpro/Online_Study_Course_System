import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { BCRYPT_SALT_ROUNDS, ROLES } from '../../config/constants';
import type { Role } from '../../config/constants';
import { RegisterInput, LoginInput } from './auth.validator';
import { createError } from '../../middleware/errorHandler';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    roles: Role[];
  };
  tokens: TokenPair;
}

export class AuthService {
  /**
   * Đăng ký tài khoản mới - tự động gán role STUDENT
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw createError('Email đã được sử dụng', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    // Tạo user + gán role STUDENT trong 1 transaction
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
        roles: {
          create: {
            role: ROLES.STUDENT,
          },
        },
      },
      include: {
        roles: { select: { role: true } },
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        roles: user.roles.map((r) => r.role as Role),
      },
      tokens,
    };
  }

  /**
   * Đăng nhập
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    // Tìm user theo email (bỏ qua soft deleted)
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
      include: {
        roles: { select: { role: true } },
      },
    });

    if (!user) {
      throw createError('Email hoặc mật khẩu không đúng', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw createError('Email hoặc mật khẩu không đúng', 401);
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        roles: user.roles.map((r) => r.role as Role),
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        userId: string;
        email: string;
      };

      // Kiểm tra user vẫn tồn tại và chưa bị xóa
      const user = await prisma.user.findFirst({
        where: { id: decoded.userId, deletedAt: null },
      });

      if (!user) {
        throw createError('User not found', 401);
      }

      return this.generateTokens(user.id, user.email);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  /**
   * Generate JWT token pair (access + refresh)
   */
  private generateTokens(userId: string, email: string): TokenPair {
    const accessToken = jwt.sign(
      { userId, email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { userId, email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
