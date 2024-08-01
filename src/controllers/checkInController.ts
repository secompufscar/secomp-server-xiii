import { Request, Response } from 'express';
import checkInService from '../services/checkInService';

export default {
    async checkIn(request: Request, response: Response) {
        const { userId, activityId } = request.params;

        console.log(userId, activityId)
   
        const data = await checkInService.checkIn(userId, activityId);

        response.status(200).json(data);
 
    },

   
};