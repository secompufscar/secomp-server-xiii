import { Expo, ExpoPushMessage } from "expo-server-sdk";
import notificationsRepository from "../repositories/notificationsRepository";
import usersRepository from "../repositories/usersRepository";
import { CreateNotificationDTO } from "../dtos/notificationsDtos";
import { Notification } from "../entities/Notification";

export default {
  async sendPushNotification(notificationData: CreateNotificationDTO) {
    const { title, message, recipientIds, ...rest } = notificationData;

    const [users, historyRecord] = await Promise.all([
      usersRepository.findManyByIds(recipientIds),
      notificationsRepository.create(notificationData),
    ]);
    
    const validTokens = users
      .map(user => user.pushToken)
      .filter((token): token is string => token !== null && Expo.isExpoPushToken(token));

    if (validTokens.length === 0) {
      console.warn(`[NotificationService] No valid push tokens found for notification ID: ${historyRecord.id}`);
      return [];
    }

    const expo = new Expo();

    const messages: ExpoPushMessage[] = validTokens.map(token => ({
      to: token,
      sound: rest.sound ? 'default' : undefined,
      title,
      body: message,
      data: rest.data || {},
      badge: rest.badge || undefined,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('[NotificationService] Error sending a notification chunk:', error);
      }
    }

    return tickets;
  },

  async getNotificationHistoryByUserId(userId: string): Promise<Notification[]> {
    return notificationsRepository.findByUserId(userId);
  },
};