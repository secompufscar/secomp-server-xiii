import { Expo } from 'expo-server-sdk';

const expo = new Expo();

// Define a estrutura para a notificação
interface PushNotification {
  title: string;
  message: string;
  data?: object;
  sound?: boolean;
  badge?: number;
}

// Função para enviar uma notificação push usando Expo
export async function sendPushNotification(token: string, notification: PushNotification) {
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Invalid Expo push token: ${token}`);
    return;
  }

  const message = {
    to: token,
    sound: notification.sound ? 'default' : null,
    title: notification.title,
    body: notification.message,
    data: (notification.data as Record<string, unknown>) || {},
    badge: notification.badge,
  };

  try {
    const ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('Notification sent:', ticket);
    return ticket;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}