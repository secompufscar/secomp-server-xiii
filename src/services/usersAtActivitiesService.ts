import { UserAtActivity } from '../entities/UserAtActivity';
import usersAtActivitiesRepository from '../repositories/usersAtActivitiesRepository';

export default {
    async findManyByActivityId(activityId: number) {
        const usersAtActivities = await usersAtActivitiesRepository.findManyByActivityId(activityId)

        return usersAtActivities
    },

    async findManyByUserId(userId: number) {
        const usersAtActivities = await usersAtActivitiesRepository.findManyByUserId(userId)

        return usersAtActivities
    },

    async create({ userId, activityId, presente, inscricaoPrevia, listaEspera }: UserAtActivity) {
        const existingUserAtActivity = await usersAtActivitiesRepository.findManyByUserIdAndActivityId(userId, activityId)

        if (existingUserAtActivity) {
            throw new Error('Usuário já está associado a esta atividade.')
        }

        const userAtActivity = await usersAtActivitiesRepository.create({
            userId,
            activityId,
            presente,
            inscricaoPrevia,
            listaEspera
        });

        return userAtActivity
    },

    async update(id: number, { presente, inscricaoPrevia, listaEspera }: UserAtActivity) {
        const existingUserAtActivity = await usersAtActivitiesRepository.findById(id);

        if (!existingUserAtActivity) {
            throw new Error('Registro não encontrado.')
        }

        const updatedUserAtActivity = await usersAtActivitiesRepository.update(id, {
            presente: presente ?? existingUserAtActivity.presente,
            inscricaoPrevia: inscricaoPrevia ?? existingUserAtActivity.inscricaoPrevia,
            listaEspera: listaEspera ?? existingUserAtActivity.listaEspera,
        });

        return updatedUserAtActivity
    },

    async delete(id: number) {
        const existingUserAtActivity = await usersAtActivitiesRepository.findById(id)

        if (!existingUserAtActivity) {
            throw new Error('Registro não encontrado.')
        }

        await usersAtActivitiesRepository.delete(id)
    }
}