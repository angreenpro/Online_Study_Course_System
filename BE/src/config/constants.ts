export const ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
} as const;

// SQLite doesn't support Prisma enums — use this instead of `import { Role } from '@prisma/client'`
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const BCRYPT_SALT_ROUNDS = 12;

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;
