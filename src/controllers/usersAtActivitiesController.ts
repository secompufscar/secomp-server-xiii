import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import usersAtActivities from "../services/usersAtActivitiesService"


export default {
  async findById(request: Request, response: Response) {
    const { activityId } = request.params;

    const data = await usersAtActivities.findManyByActivityId(activityId)

    response.status(200).json(data)
  },

  async findByUserId(request: Request, response: Response) {
    const { userId } = request.params;

    const data = await usersAtActivities.findManyByUserId(userId)

    response.status(200).json(data)
  },

  async findByUserIdActivityId(request: Request, response: Response) {
    const { userId, activityId} = request.params;

    const data = await usersAtActivities.findUserAtActivity(userId, activityId)

    response.status(200).json(data)
  },

async create(request: Request, response: Response) {
       
        const { activityId } = request.body;
        const userId = request.user?.id;

        if (!userId) {
            throw new Error('Usuário não autenticado');
        }
        
        const data = await usersAtActivities.create({ userId, activityId });

        response.status(201).json(data);
    },
  async update(request: Request, response: Response) {
    const { id } = request.params;

    const data = await usersAtActivities.update(id, request.body)

    response.status(200).json(data)
  },

  async delete(request: Request, response: Response) {
    const {userId, activityId } = request.params;

    await usersAtActivities.delete(userId, activityId)

    response.status(200).send()
  }
}