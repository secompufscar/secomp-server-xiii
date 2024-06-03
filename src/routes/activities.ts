import express from 'express';
import activityController from '../controllers/activityController';

const router = express.Router();

router.post('/', activityController.createAtividade);
router.get('/', activityController.getAllAtividades);
router.delete('/:id', activityController.deleteAtividade);
router.put('/:id', activityController.updateAtividade);

export default router;
