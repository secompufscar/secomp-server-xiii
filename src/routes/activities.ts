import express from 'express';
import activityController from '../controllers/activity/activityController';
import { createCategorySchema } from '../schemas/categorySchema';
import validate from '../middlewares/validate';
import { createActivitySchema, activityIdSchema, updateActivitySchema} from '../schemas/activitySchema';
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router();

router.post('/', authMiddleware, validate(createActivitySchema), activityController.createAtividade);
router.get('/', authMiddleware, activityController.getAllAtividades);
router.get('/:id', authMiddleware, validate(undefined, activityIdSchema),activityController.getActivityById);
router.delete('/:id', authMiddleware, validate(undefined, activityIdSchema) ,activityController.deleteAtividade);
router.put('/:id', authMiddleware, validate(updateActivitySchema, activityIdSchema),activityController.updateAtividade);

export default router;
