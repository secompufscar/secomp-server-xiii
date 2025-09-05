import cron from 'node-cron';
import { subHours } from 'date-fns';
import { format } from 'date-fns-tz'; // Importe o 'format' de 'date-fns-tz'
import activitiesRepository from '../repositories/activitiesRepository';
import usersAtActivitiesRepository from '../repositories/usersAtActivitiesRepository';
import notificationService from './notificationService';
import { ActivityDTOS, CreateActivityDTOS, UpdateActivityDTOS } from '../dtos/activitiesDtos';

const scheduleNotificationsForActivity = (activity: ActivityDTOS | CreateActivityDTOS | UpdateActivityDTOS) => {
  if (!activity.data) return;

  const activityDate = new Date(activity.data);
  const now = new Date();
  const timeZone = 'America/Sao_Paulo'; // fuso horário alvo

  if (!('id' in activity) || !activity.id) return;
  const activityId = activity.id;

  const scheduleJob = (notificationDate: Date, title: string, message: string) => {
    if (notificationDate > now) {
      // 1. Gera o cronTime com base no fuso horário de São Paulo
      const minute = format(notificationDate, 'm', { timeZone });
      const hour = format(notificationDate, 'H', { timeZone });
      const dayOfMonth = format(notificationDate, 'd', { timeZone });
      const month = format(notificationDate, 'M', { timeZone });
      
      const cronTime = `${minute} ${hour} ${dayOfMonth} ${month} *`;

      // 2. Informa ao node-cron para interpretar o cronTime nesse mesmo fuso horário
      cron.schedule(cronTime, async () => {
        const users = await usersAtActivitiesRepository.findManyByActivityId(activityId);
        const userIds = users.map(u => u.userId);
        if (userIds.length > 0) {
          notificationService.sendPushNotification({
            title,
            message,
            recipientIds: userIds,
            data: { activityId: activityId }
          });
        }
      }, {
        timezone: timeZone
      });
    }
  };

  // Agenda a notificação para 24 horas antes
  const notificationTime24h = subHours(activityDate, 24);
  scheduleJob(
    notificationTime24h,
    'Lembrete de Atividade',
    `A atividade "${activity.nome}" começará em 24 horas!`
  );

  // Agenda a notificação para 2 horas antes
  const notificationTime2h = subHours(activityDate, 2);
  scheduleJob(
    notificationTime2h,
    'Atividade Começando em Breve',
    `A atividade "${activity.nome}" começará em 2 horas!`
  );
};

const scheduleAllActivityNotifications = async () => {
  const activities = await activitiesRepository.list();
  activities.forEach(scheduleNotificationsForActivity);
};

export default {
  scheduleAllActivityNotifications,
  scheduleNotificationsForActivity
};