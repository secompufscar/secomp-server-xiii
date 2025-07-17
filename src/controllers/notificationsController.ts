import { Request, Response } from 'express';
import notificationService from '../services/notificationService';
import usersRepository from '../repositories/usersRepository';
import { CreateNotificationDTO } from '../dtos/notificationsDtos';

export default {
  async sendNotification(req: Request, res: Response) {
    try {
      const createdBy = req.user?.id;
      const { recipientIds, title, message, data, sound, badge } = req.body;
      
      // Validação
      if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
        return res.status(400).json({ error: 'recipientIds must be a non-empty array' });
      }

      // Buscar usuários destinatários
      const users = await usersRepository.findManyByIds(recipientIds);
      
      // Verificar se todos os usuários existem
      if (users.length !== recipientIds.length) {
        return res.status(404).json({ error: 'One or more users not found' });
      }

      // Preparar DTO
      const notificationDto: CreateNotificationDTO = {
        title,
        message,
        recipientIds,
        data,
        sound: sound ?? true,
        badge,
        createdBy
      };

      // Enviar notificação
      await notificationService.sendPushNotification(notificationDto);

      res.status(200).json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send notification';
      console.error('Notification error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  },

  // Adicionar outros métodos de controller...
};