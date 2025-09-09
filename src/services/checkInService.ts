import checkInRepository from "../repositories/checkInRepository";
import activitiesRepository from "../repositories/activitiesRepository";
import usersRepository from "../repositories/usersRepository";
import eventService from "./eventService";
import { UserAtActivity } from "../entities/UserAtActivity";

export default {
  async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
    const activity = await activitiesRepository.findById(activityId);

    if (!activity) {
      throw new Error("Atividade não encontrada.");
    }

    const registration = await eventService.getUserRegistration(userId);
    if (!registration || registration.status !== 1) {
      throw new Error("Usuário não está inscrito neste evento");
    }

    if (activity.categoriaId === "1") {
      const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

      if (!userAtActivity) {
        throw new Error("Usuário não está cadastrado na atividade.");
      }

      const pointsToAdd = activity.points;
      await usersRepository.addPoints(userId, pointsToAdd);

      const updatedUserAtActivity = await checkInRepository.markAsPresent(userAtActivity.id);

      return updatedUserAtActivity;
    }

    const pointsToAdd = activity.points;
    await usersRepository.addPoints(userId, pointsToAdd);

    const updatedUserAtActivity = await checkInRepository.markAsPresentWithoutSubscription(
      userId,
      activityId
    );

    return updatedUserAtActivity;
  },
};