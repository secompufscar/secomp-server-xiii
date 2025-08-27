import usersAtActivitiesRepository from "../repositories/usersAtActivitiesRepository";
import activitiesRepository from "../repositories/activitiesRepository";
import checkInRepository from "../repositories/checkInRepository";
import userEventRepository from "../repositories/userEventRepository";
import userRepository from "../repositories/usersRepository";
import eventRepository from "../repositories/eventRepository";

import { UpdateUserAtActivityDTOS, CreateUserAtActivityDTOS } from "../dtos/userAtActivitiesDtos";

export default {
  async findManyByActivityId(activityId: string) {
    const usersAtActivities = await usersAtActivitiesRepository.findManyByActivityId(activityId);

    return usersAtActivities;
  },

  async findManyByUserId(userId: string) {
    const usersAtActivities = await usersAtActivitiesRepository.findManyByUserId(userId);

    return usersAtActivities;
  },

  async findUserAtActivity(userId: string, activityId: string) {
    const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

    return userAtActivity;
  },

  async create({ userId, activityId }: CreateUserAtActivityDTOS) {
    const currentEvent = await eventRepository.findCurrent();
    if (!currentEvent) {
      throw new Error("Nenhum evento ativo no momento, nao é possivel fazer inscricao.");
    }
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    const registration = await userEventRepository.getUserRegistration(userId, currentEvent.id);
    if (!registration || registration.status !== 1) {
      throw new Error("Você precisa estar inscrito no evento anual para participar de atividades");
    }

    const isFull = await activitiesRepository.isActivityFull(activityId);

    const userAtActivity = await usersAtActivitiesRepository.create({
      userId,
      activityId,
      presente: false,
      inscricaoPrevia: true,
      listaEspera: isFull,
    });

    return userAtActivity;
  },

  async update(id: string, { presente, inscricaoPrevia, listaEspera }: UpdateUserAtActivityDTOS) {
    const existingUserAtActivity = await usersAtActivitiesRepository.findById(id);

    if (!existingUserAtActivity) {
      throw new Error("Registro não encontrado.");
    }
    if (presente === true && existingUserAtActivity.presente === false) {
      const activity = await activitiesRepository.findById(existingUserAtActivity.activityId);

      if (activity && activity.points && activity.points > 0) {
        await userRepository.addPoints(existingUserAtActivity.userId, activity.points);
      }
    }
    const updatedUserAtActivity = await usersAtActivitiesRepository.update(id, {
      presente: presente ?? existingUserAtActivity.presente,
      inscricaoPrevia: inscricaoPrevia ?? existingUserAtActivity.inscricaoPrevia,
      listaEspera: listaEspera ?? existingUserAtActivity.listaEspera,
    });

    return updatedUserAtActivity;
  },

  async delete(userId: string, activityId: string) {
    const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

    if (!userAtActivity) {
      throw new Error("Registro não encontrado.");
    }

    await usersAtActivitiesRepository.delete(userAtActivity.id);

    const nextInLine = await usersAtActivitiesRepository.findFirstInWaitlist(
      userAtActivity.activityId,
    );

    if (nextInLine) {
      await usersAtActivitiesRepository.update(nextInLine.id, {
        listaEspera: false,
        inscricaoPrevia: true,
        presente: false,
      });
    }
    return userAtActivity;
  },
};
