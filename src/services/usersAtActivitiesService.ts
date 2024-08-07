import { UserAtActivity } from '../entities/UserAtActivity';
import usersAtActivitiesRepository from '../repositories/usersAtActivitiesRepository';
import activitiesRepository from '../repositories/activitiesRepository';

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

    async create({ userId, activityId }: CreateUserAtActivityDTOS) {
        const existingUserAtActivity = await usersAtActivitiesRepository.findByUserIdAndActivityId(userId, activityId)

        if (existingUserAtActivity) {
            throw new Error('Usuário já está associado a esta atividade.')
        }
        const isFull = await activitiesRepository.isActivityFull(activityId);

        const userAtActivity = await usersAtActivitiesRepository.create({
            userId,
            activityId,
            presente: false,
            inscricaoPrevia: true,
            listaEspera: isFull
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
        const existingUserAtActivity = await usersAtActivitiesRepository.findById(id);

        if (!existingUserAtActivity) {
    
            throw new Error('Registro não encontrado.');
        }

        // Deleta a inscrição do usuário
        await usersAtActivitiesRepository.delete(id);
    

        // Verifica se há usuários na lista de espera
        const nextInLine = await usersAtActivitiesRepository.findFirstInWaitlist(existingUserAtActivity.activityId);

        if (nextInLine) {
            // Atualiza o status do próximo na lista de espera para um participante ativo
            await usersAtActivitiesRepository.update(nextInLine.id, {
                listaEspera: false,
                inscricaoPrevia: true,
                presente: false
            });
        }
        return existingUserAtActivity
    },
}