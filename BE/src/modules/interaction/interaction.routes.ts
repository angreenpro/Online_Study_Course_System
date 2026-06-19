import { Router } from 'express';
import { interactionController } from './interaction.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

// Notes API
router.get('/notes/:lessonId', interactionController.getNotes);
router.post('/notes', interactionController.createNote);
router.delete('/notes/:id', interactionController.deleteNote);

// Discussions API
router.get('/discussions/:lessonId', interactionController.getDiscussions);
router.post('/discussions', interactionController.createDiscussion);
router.delete('/discussions/:id', interactionController.deleteDiscussion);

export default router;
