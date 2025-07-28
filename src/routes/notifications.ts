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

// Rota para envar notificações para todos os usuários
router.post('/send-to-all',
  authMiddleware, 
  adminMiddleware, // Somente admins podem enviar notificações
  notificationsController.sendNotificationToAll
);
export default router;