import checkInRepository from '../repositories/checkInRepository';
import { UserAtActivity } from '../entities/UserAtActivity';

export default {
    async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
        const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

        if (!userAtActivity) {
            throw new Error('User is not registered for this activity');
        }

        // Marcar como presente
        const updatedUserAtActivity = await checkInRepository.markAsPresent(userAtActivity.id);

        return updatedUserAtActivity;
    },

};
