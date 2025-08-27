import { Request, Response } from 'express';
import notificationService from '../services/notificationService';
import usersRepository from '../repositories/usersRepository';
import { CreateNotificationDTO } from '../dtos/notificationsDtos';

export default {
  async sendNotification(req: Request, res: Response) {
    try {
      const createdBy = req.user?.id;
      const { recipientIds, title, message, data, sound, badge } = req.body;
      
      if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
        return res.status(400).json({ error: 'recipientIds must be a non-empty array' });
      }

      const users = await usersRepository.findManyByIds(recipientIds);
      
      if (users.length !== recipientIds.length) {
        return res.status(404).json({ error: 'One or more users not found' });
      }

      const notificationDto: CreateNotificationDTO = {
        title,
        message,
        recipientIds,
        data,
        sound: sound ?? true,
        badge,
        createdBy
      };

      await notificationService.sendPushNotification(notificationDto);

      res.status(200).json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send notification';
      console.error('Notification error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  },

  // Enviar notificações para todos os usuários
  async sendNotificationToAll(req: Request, res: Response) {
    try {
      const createdBy = req.user?.id;
      const { title, message, data, sound, badge } = req.body;

      const users = await usersRepository.findAll();

      const recipientIds = users.map(user => user.id);
      const notificationDto: CreateNotificationDTO = {
        title,
        message,
        recipientIds,
        data,
        sound: sound ?? true,
        badge,
        createdBy
      };

      await notificationService.sendPushNotification(notificationDto);

      res.status(200).json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send notification to all';
      console.error('Notification error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  },

  // Obter histórico de notificações do usuário
  async getNotificationHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const notifications = await notificationService.getNotificationHistoryByUserId(userId);
      res.status(200).json(notifications);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve notification history';
      console.error('Notification history error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  },
};