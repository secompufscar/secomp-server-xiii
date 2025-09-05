import cron from 'node-cron';
import { subHours } from 'date-fns';
import activitiesRepository from '../repositories/activitiesRepository';
import usersAtActivitiesRepository from '../repositories/usersAtActivitiesRepository';
import notificationService from './notificationService';
import { ActivityDTOS, CreateActivityDTOS, UpdateActivityDTOS } from '../dtos/activitiesDtos';

const scheduleNotificationsForActivity = (activity: ActivityDTOS | CreateActivityDTOS | UpdateActivityDTOS) => {
  if (!activity.data) return;

  const activityDate = new Date(activity.data);
  const now = new Date();

  // Garante que temos um ID para consultar os usuários
  if (!('id' in activity) || !activity.id) return;
  const activityId = activity.id;

  // Agenda a notificação para 24 horas antes
  const notificationTime24hBase = subHours(activityDate, 24);
  const notificationTime24h = subHours(notificationTime24hBase, 3); // Ajuste de -3 horas para o fuso

  if (notificationTime24h > now) {
    const cronTime = `${notificationTime24h.getMinutes()} ${notificationTime24h.getHours()} ${notificationTime24h.getDate()} ${notificationTime24h.getMonth() + 1} *`;
    cron.schedule(cronTime, async () => {
      const users = await usersAtActivitiesRepository.findManyByActivityId(activityId);
      const userIds = users.map(u => u.userId);
      if (userIds.length > 0) {
        notificationService.sendPushNotification({
          title: 'Lembrete de Atividade',
          message: `A atividade "${activity.nome}" começará em 24 horas!`,
          recipientIds: userIds,
          data: { activityId: activityId } 
        });
      }
    });
  }

  // Agenda a notificação para 2 horas antes
  const notificationTime2hBase = subHours(activityDate, 2);
  const notificationTime2h = subHours(notificationTime2hBase, 3); // Ajuste de -3 horas para o fuso

  if (notificationTime2h > now) {
    const cronTime = `${notificationTime2h.getMinutes()} ${notificationTime2h.getHours()} ${notificationTime2h.getDate()} ${notificationTime2h.getMonth() + 1} *`;
    cron.schedule(cronTime, async () => {
      const users = await usersAtActivitiesRepository.findManyByActivityId(activityId);
      const userIds = users.map(u => u.userId);
      if (userIds.length > 0) {
        notificationService.sendPushNotification({
          title: 'Atividade Começando em Breve',
          message: `A atividade "${activity.nome}" começará em 2 horas!`,
          recipientIds: userIds,
          data: { activityId: activityId } 
        });
      }
    });
  }
};

const scheduleAllActivityNotifications = async () => {
  const activities = await activitiesRepository.list();
  activities.forEach(scheduleNotificationsForActivity);
};

export default {
  scheduleAllActivityNotifications,
  scheduleNotificationsForActivity
};