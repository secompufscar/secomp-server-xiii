import checkInRepository from '../repositories/checkInRepository';
import { UserAtActivity } from '../entities/UserAtActivity';
import eventService from "./eventService";

export default {
    async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
        const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

        if (!userAtActivity) {
            throw new Error('Usuário não está cadastrado na atividade.');
        }
        // verifica se usuário esta inscrito no evento (nova verificação)
        const registration = await eventService.getUserRegistration(userId);
        if (!registration || registration.status !== 1) {
            throw new Error("Usuário não está inscrito neste evento");
      }

        // Marcar como presente
        return await checkInRepository.markAsPresent(userAtActivity.id);
    },

};
