import { Expo } from 'expo-server-sdk';
import notificationsRepository from '../repositories/notificationsRepository';
import usersRepository from '../repositories/usersRepository';
import { CreateNotificationDTO } from '../dtos/notificationsDtos';
import { Notification } from '../entities/Notification';
import { User } from '@prisma/client';

export default {
  async sendPushNotification(notificationData: CreateNotificationDTO): Promise<any> {
    const expo = new Expo();
    const { title, message, recipientIds, createdBy, ...rest } = notificationData;

    // Buscar usuários destinatários
    const users = await usersRepository.findManyByIds(recipientIds);
    
    // Coletar tokens válidos
    const validTokens = users
      .map((user: User) => user.pushToken)
      .filter(token => token && Expo.isExpoPushToken(token)) as string[];

    if (validTokens.length === 0) {
      console.warn('No valid push tokens found for recipients:', recipientIds);
      return [];
    }

    // Criar registro histórico
    const historyRecord = await notificationsRepository.create(notificationData);

    try {
      // Preparar mensagens
      const messages = validTokens.map(token => ({
        to: token,
        sound: rest.sound ? 'default' : undefined,
        title,
        body: message,
        data: rest.data || {},
        badge: rest.badge || undefined,
      }));

      // Enviar em chunks
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending notification chunk:', error);
        }
      }

      return tickets;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error sending notifications:', errorMessage);

      throw new Error(errorMessage);
    }
  },

  async getNotificationHistoryByUserId(userId: string): Promise<Notification[]> {
    return notificationsRepository.findByUserId(userId);
  },
};