import checkInRepository from '../repositories/checkInRepository';
import { UserAtActivity } from '../entities/UserAtActivity';
import activitiesRepository from '../repositories/activitiesRepository';
import usersRepository from '../repositories/usersRepository'; 

export default {
    async checkIn(userId: string, activityId: string): Promise<UserAtActivity> {
        const userAtActivity = await checkInRepository.findUserAtActivity(userId, activityId);
        console.log(userAtActivity);
        if (!userAtActivity) {
            console.log(userAtActivity)
            throw new Error('Usuário não está cadastrado na atividade.');
        }
        const activity = await activitiesRepository.findById(activityId);

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


    },

};
