import checkInRepository from '../repositories/checkInRepository';
import { UserAtActivity } from '../entities/UserAtActivity';

export default {
    async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
        const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

        if (!userAtActivity) {
            throw new Error('Usuário não está cadastrado na atividade.');
        }

        // Marcar como presente
        return await checkInRepository.markAsPresent(userAtActivity.id);


    },

};
