import { Request, Response } from 'express';
import { sendPushNotification } from '../services/notificationService';
import usersRepository from '../repositories/usersRepository';

export default {
  async sendNotification(req: Request, res: Response) {
    try {
      const { userId, title, message, data, sound, badge } = req.body;
      
      // Buscar usuário pelo ID
      const user = await usersRepository.findById(userId);
      
      if (!user || !user.pushToken) {
        return res.status(404).json({ error: 'User or push token not found' });
      }

      // Se o pushToken for um array, pegue o primeiro token válido
      const pushToken = Array.isArray(user.pushToken) ? user.pushToken[0] : user.pushToken;

      // Enviar notificação
      await sendPushNotification(pushToken, {
        title,
        message,
        data,
        sound: sound ?? true,
        badge
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Notification error:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  }
}