import { Router } from 'express';
import checkInController from '../controllers/checkInController';
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router();

router.post('/:userId/:activityId',authMiddleware, checkInController.checkIn);
router.get('/participants/:activityId', authMiddleware, checkInController.listParticipants);

export default router;