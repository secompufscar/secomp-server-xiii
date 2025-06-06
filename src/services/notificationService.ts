import { Expo } from 'expo-server-sdk';

interface NotificationData {
  title: string;
  message: string;
  data?: Record<string, any>;
  sound?: boolean;
  badge?: number;
}

export async function sendPushNotification(
  tokens: string[],
  notification: NotificationData
) {
  const expo = new Expo();
  const validTokens = tokens.filter(token => Expo.isExpoPushToken(token));
  
  if (validTokens.length === 0) return;

  const messages = validTokens.map(token => ({
    to: token,
    title: notification.title,
    body: notification.message,
    data: notification.data || {},
    sound: notification.sound ? 'default' : undefined,
    badge: notification.badge,
  }));

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  return tickets;
}