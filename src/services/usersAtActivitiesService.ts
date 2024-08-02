import { UserAtActivity } from '../entities/UserAtActivity';
import usersAtActivitiesRepository from '../repositories/usersAtActivitiesRepository';

import { UpdateUserAtActivityDTOS, CreateUserAtActivityDTOS } from '../dtos/userAtActivitiesDtos';

export default {
    async findManyByActivityId(activityId: string) {
        const usersAtActivities = await usersAtActivitiesRepository.findManyByActivityId(activityId)

        return usersAtActivities
    },

    async findManyByUserId(userId: string) {
        const usersAtActivities = await usersAtActivitiesRepository.findManyByUserId(userId)

        return usersAtActivities
    },

    async create({ userId, activityId, presente, inscricaoPrevia, listaEspera }: CreateUserAtActivityDTOS) {
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

    async update(id: string, { presente, inscricaoPrevia, listaEspera }: UpdateUserAtActivityDTOS) {
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

    async delete(id: string) {
        const existingUserAtActivity = await usersAtActivitiesRepository.findById(id)

        if (!existingUserAtActivity) {
            throw new Error('Registro não encontrado.')
        }

        await usersAtActivitiesRepository.delete(id)
    }
}