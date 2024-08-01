import { Request, Response } from 'express';
import checkInService from '../services/checkInService';

export default {
    async checkIn(request: Request, response: Response) {
        const { userId, activityId } = request.body;

   
        const data = await checkInService.checkIn(userId, activityId);

        response.status(200).json(data);
 
    },

   
};