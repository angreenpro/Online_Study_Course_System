import express from 'express';
import { courseController } from './course.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate';
import {
  createCourseSchema,
  updateCourseSchema,
  createSectionSchema,
  updateSectionSchema,
  createLessonSchema,
  updateLessonSchema,
} from './course.validator';

const router = express.Router();

// Public routes
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);

// Instructor routes - Course
router.post(
  '/',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(createCourseSchema),
  courseController.createCourse
);

router.put(
  '/:id',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(updateCourseSchema),
  courseController.updateCourse
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('INSTRUCTOR'),
  courseController.deleteCourse
);

// Instructor routes - Section
router.post(
  '/:courseId/sections',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(createSectionSchema),
  courseController.createSection
);

router.put(
  '/sections/:id',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(updateSectionSchema),
  courseController.updateSection
);

router.delete(
  '/sections/:id',
  requireAuth,
  requireRole('INSTRUCTOR'),
  courseController.deleteSection
);

// Instructor routes - Lesson
router.post(
  '/sections/:sectionId/lessons',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(createLessonSchema),
  courseController.createLesson
);

router.put(
  '/lessons/:id',
  requireAuth,
  requireRole('INSTRUCTOR'),
  validate(updateLessonSchema),
  courseController.updateLesson
);

router.delete(
  '/lessons/:id',
  requireAuth,
  requireRole('INSTRUCTOR'),
  courseController.deleteLesson
);

export default router;
