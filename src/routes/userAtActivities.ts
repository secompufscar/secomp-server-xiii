import express from 'express';
import userAtActivityController from '../controllers/userAtActivity/userAtActivityController';
import { authMiddleware } from '../middlewares/authMiddleware'


const router = express.Router();

router.post('/', authMiddleware, userAtActivityController.createUserAtActivity);
router.get('/:activityId', authMiddleware, userAtActivityController.getUserAtActivityByActivityId)
router.delete('/:activityId/:id', authMiddleware, userAtActivityController.deleteUserAtActivity)
router.put('/:activityId/:id', authMiddleware, userAtActivityController.updateUserAtActivity)
router.get('/all-activities/:userId', authMiddleware, userAtActivityController.getAllActivitiesByUserId)


export default router;
