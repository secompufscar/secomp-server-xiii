import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import notificationsController from '../controllers/notificationsController';

const router = Router();

// Rota para enviar notificações push
router.post('/send', 
  authMiddleware, 
  adminMiddleware,
  notificationsController.sendNotification
);

// Rota para envar notificações para todos os usuários
router.post('/send-to-all',
  authMiddleware, 
  adminMiddleware, 
  notificationsController.sendNotificationToAll
);

// Rota para obter histórico de notificações por usuário
router.get('/history',
  authMiddleware, 
  notificationsController.getNotificationHistory
);
export default router;