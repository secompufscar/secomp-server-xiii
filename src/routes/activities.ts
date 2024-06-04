import express from 'express';
import activityController from '../controllers/activity/activityController';
import { createCategorySchema } from '../schemas/categorySchema';
import validate from '../middlewares/validate';
import { createActivitySchema, activityIdSchema, updateActivitySchema } from '../schemas/activitySchema';

const router = express.Router();

router.post('/', validate(createActivitySchema), activityController.createAtividade);
router.get('/', activityController.getAllAtividades);
router.delete('/:id', validate(undefined, activityIdSchema) ,activityController.deleteAtividade);
router.put('/:id', validate(updateActivitySchema, activityIdSchema),activityController.updateAtividade);

export default router;
