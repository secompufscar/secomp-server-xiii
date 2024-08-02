import checkInRepository from '../repositories/checkInRepository';
import { UserAtActivity } from '../entities/UserAtActivity';

export default {
    async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
        const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

        if (!userAtActivity) {
            return await checkInRepository.createWaitlistEntry(userId, activityId);
        }

        // Marcar como presente
        return await checkInRepository.markAsPresent(userAtActivity.id);


    },

};
