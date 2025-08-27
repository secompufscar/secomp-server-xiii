import checkInRepository from "../repositories/checkInRepository";
import activitiesRepository from "../repositories/activitiesRepository";
import usersRepository from "../repositories/usersRepository";
import eventService from "./eventService";
import { UserAtActivity } from "../entities/UserAtActivity";

export default {
  async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
    const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

    if (!userAtActivity) {
      throw new Error("Usuário não está cadastrado na atividade.");
    }

    const activity = await activitiesRepository.findById(activityId);

    const registration = await eventService.getUserRegistration(userId);
    if (!registration || registration.status !== 1) {
      throw new Error("Usuário não está inscrito neste evento");
    }

    if (!activity) {
      throw new Error("Atividade não encontrada.");
    }

    const pointsToAdd = activity.points;
    await usersRepository.addPoints(userId, pointsToAdd);

    const updatedUserAtActivity = await checkInRepository.markAsPresent(userAtActivity.id);

    return updatedUserAtActivity;
  },
};