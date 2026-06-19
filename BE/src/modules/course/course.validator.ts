import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Tiêu đề quá ngắn').max(100, 'Tiêu đề quá dài'),
  description: z.string().min(10, 'Mô tả quá ngắn'),
  price: z.number().min(0, 'Giá không hợp lệ'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  thumbnailUrl: z.string().url('URL không hợp lệ').optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createSectionSchema = z.object({
  title: z.string().min(3, 'Tiêu đề section quá ngắn').max(100),
  order: z.number().min(1),
});

export const updateSectionSchema = createSectionSchema.partial();

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Tiêu đề bài học quá ngắn').max(100),
  order: z.number().min(1),
  duration: z.number().min(0).default(0),
  type: z.enum(['VIDEO', 'READING', 'QUIZ']),
  contentUrl: z.string().optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

