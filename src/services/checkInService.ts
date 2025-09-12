import checkInRepository from "../repositories/checkInRepository";
import activitiesRepository from "../repositories/activitiesRepository";
import usersRepository from "../repositories/usersRepository";
import eventService from "./eventService";
import { UserAtActivity } from "../entities/UserAtActivity";
import { ApiError, ErrorsCode } from "../utils/api-errors";

export default {
  async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
    const activity = await activitiesRepository.findById(activityId);

    if (!activity) {
      throw new ApiError("Atividade não encontrada", ErrorsCode.NOT_FOUND);
    }

    const registration = await eventService.getUserRegistration(userId);
    if (!registration || registration.status !== 1) {
      throw new ApiError("Usuário não esta inscrito neste evento!", ErrorsCode.BAD_REQUEST);
    }

    if (activity.categoriaId === "1") {
      const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

      if (!userAtActivity) {
        throw new ApiError("Usuário não está cadastrado na atividade", ErrorsCode.BAD_REQUEST);
      }

      const pointsToAdd = activity.points;
      await usersRepository.addPoints(userId, pointsToAdd);

      const updatedUserAtActivity = await checkInRepository.markAsPresent(userAtActivity.id);

      return updatedUserAtActivity;
    }

    const pointsToAdd = activity.points;
    await usersRepository.addPoints(userId, pointsToAdd);

    const updatedUserAtActivity = await checkInRepository.markAsPresentWithoutSubscription(userId, activityId);

    return updatedUserAtActivity;
  },
};
