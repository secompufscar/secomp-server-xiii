import checkInRepository from '../repositories/checkInRepository';
import { UserAtActivity } from '../entities/UserAtActivity';
import activitiesRepository from '../repositories/activitiesRepository';
import usersRepository from '../repositories/usersRepository'; 
import eventService from "./eventService";

export default {
    async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
        const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);

        if (!userAtActivity) {
            throw new Error('Usuário não está cadastrado na atividade.');
        }
        const activity = await activitiesRepository.findById(activityId);
      
        // verifica se usuário esta inscrito no evento (nova verificação)
        const registration = await eventService.getUserRegistration(userId);
        if (!registration || registration.status !== 1) {
            throw new Error("Usuário não está inscrito neste evento");
        }

        if (!activity) {
            throw new Error("Atividade não encontrada.");
        } 
      
        
        // Marcar como presente
         const updatedUserAtActivity = await checkInRepository.markAsPresent(userAtActivity.id);

        //Adicionar a pontuação da atividade ao total de pontos do usuário
        const pointsToAdd = activity.points;
        
        // Chama o método no usersRepository para incrementar os pontos do usuário
        await usersRepository.addPoints(userId, pointsToAdd);

        // Retorna o registro de presença atualizado
        return updatedUserAtActivity;

        return await checkInRepository.markAsPresent(userAtActivity.id);
    },

};
