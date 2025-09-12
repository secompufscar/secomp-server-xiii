import * as cron from "node-cron"; // Corrija esta linha
import { subHours, addHours } from "date-fns";
import activitiesRepository from "../repositories/activitiesRepository";
import usersAtActivitiesRepository from "../repositories/usersAtActivitiesRepository";
import notificationService from "./notificationService";
import { ActivityDTOS, CreateActivityDTOS, UpdateActivityDTOS } from "../dtos/activitiesDtos";
import { ApiError, ErrorsCode } from "../utils/api-errors";

// Objeto para armazenar as tarefas agendadas por ID da atividade
const scheduledJobs: { [activityId: string]: cron.ScheduledTask[] } = {};

const scheduleNotificationsForActivity = (activity: ActivityDTOS | CreateActivityDTOS | UpdateActivityDTOS) => {
  if (!("id" in activity) || !activity.id || !activity.data) {
    throw new ApiError("data sent was malformed", ErrorsCode.BAD_REQUEST);
  }
  const activityId = activity.id;

  // Cancela e remove qualquer agendamento antigo para esta atividade
  if (scheduledJobs[activityId]) {
    console.log(`[Scheduler] Removendo agendamentos antigos para a atividade ID: ${activityId}`);
    scheduledJobs[activityId].forEach((job) => job.stop());
    delete scheduledJobs[activityId];
  }

  const activityDate = new Date(activity.data);
  const now = new Date();

  // Função auxiliar para criar e armazenar uma tarefa
  const scheduleAndStoreJob = (notificationDate: Date, title: string, message: string) => {
    // Adiciona 3 horas para compensar a conversão implícita para UTC
    const adjustedDate = addHours(notificationDate, 3);

    if (adjustedDate > now) {
      const cronTime = `${adjustedDate.getMinutes()} ${adjustedDate.getHours()} ${adjustedDate.getDate()} ${adjustedDate.getMonth() + 1} *`;

      const job = cron.schedule(cronTime, async () => {
        console.log(`[Scheduler] EXECUTANDO TAREFA para atividade "${activity.nome}" (ID: ${activityId})`);

        const users = await usersAtActivitiesRepository.findManyByActivityId(activityId);
        const userIds = users.map((u) => u.userId);

        if (userIds.length > 0) {
          console.log(`[Scheduler] Encontrados ${userIds.length} usuários para notificar: ${userIds.join(", ")}`);
          notificationService.sendPushNotification({ title, message, recipientIds: userIds, data: { activityId } });
        } else {
          console.log(`[Scheduler] Nenhum usuário encontrado inscrito na atividade ${activityId}. Nenhuma notificação enviada.`);
        }
      });

      // Armazena a nova tarefa
      if (!scheduledJobs[activityId]) {
        scheduledJobs[activityId] = [];
      }
      scheduledJobs[activityId].push(job);
      console.log(`[Scheduler] Tarefa agendada para atividade "${activity.nome}" (ID: ${activityId}) para ser executada em: ${cronTime}`);
    } else {
      console.log(
        `[Scheduler] O horário da notificação para a atividade "${activity.nome}" (ID: ${activityId}) já passou. Não foi agendada.`,
      );
    }
  };

  // Agenda a notificação para 24 horas antes
  scheduleAndStoreJob(subHours(activityDate, 24), "Lembrete de Atividade", `A atividade "${activity.nome}" começará em 24 horas!`);

  // Agenda a notificação para 2 horas antes
  scheduleAndStoreJob(subHours(activityDate, 2), "Atividade Começando em Breve", `A atividade "${activity.nome}" começará em 2 horas!`);
};

const scheduleAllActivityNotifications = async () => {
  console.log("[Scheduler] Iniciando agendamento de todas as atividades...");
  const activities = await activitiesRepository.list();
  activities.forEach(scheduleNotificationsForActivity);
  console.log("[Scheduler] Agendamento inicial concluído.");
};

export default {
  scheduleAllActivityNotifications,
  scheduleNotificationsForActivity,
};
