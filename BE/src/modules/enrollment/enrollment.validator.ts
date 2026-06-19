import { z } from 'zod';

export const enrollSchema = z.object({
  courseId: z.string({ required_error: 'Course ID is required' }),
});
