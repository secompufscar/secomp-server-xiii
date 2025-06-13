import { Router } from 'express';
import notificationsController from '../controllers/notificationsController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

// Rota para enviar notificações push
router.post('/send', 
  authMiddleware, 
  adminMiddleware, // Somente admins podem enviar notificações
  notificationsController.sendNotification
);

export default router;