import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .optional(),
  avatarUrl: z
    .string()
    .url('URL avatar không hợp lệ')
    .optional()
    .nullable(),
});

export const updateUserRolesSchema = z.object({
  roles: z
    .array(z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']))
    .min(1, 'Phải có ít nhất 1 vai trò'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUserRolesInput = z.infer<typeof updateUserRolesSchema>;
