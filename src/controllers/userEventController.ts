// src/controllers/userEventController.ts
import { Request, Response } from 'express';
import userEventService from '../services/userEventService';
import { CreateUserEventDTOS } from '../dtos/userEventDtos';

export default {
  async findByEventId(request: Request, response: Response) {
    const { eventId } = request.params;
    const data = await userEventService.findByEvent(eventId);
    response.status(200).json(data);
  },

  async findByUserId(request: Request, response: Response) {
    const { userId } = request.params;
    const data = await userEventService.findByUser(userId);
    response.status(200).json(data);
  },

  async findByUserIdEventId(request: Request, response: Response) {
    const { userId, eventId } = request.params;
    const data = await userEventService.findByUserAndEvent(userId, eventId);
    response.status(200).json(data);
  },

  // Em src/controllers/userEventController.ts
async create(request: Request, response: Response) {
        const userIdFromToken = (request as any).user?.id;
        const { eventId } = request.body;

        if (!userIdFromToken) { /* ... erro 401 ... */ }
        if (!eventId) { /* ... erro 400 ... */ }

        // Controller monta o DTO para o serviço
        const createUserEventData: CreateUserEventDTOS = {
            userId: userIdFromToken,
            eventId: eventId,
            status: 1 // Controller define o status inicial
        };
        
        const newUserEvent = await userEventService.create(createUserEventData);
        return response.status(201).json(newUserEvent);
    
    },


  async update(request: Request, response: Response) {
    const { id } = request.params;
    const data = await userEventService.update(id, request.body);
    response.status(200).json(data);
  },

  async delete(request: Request, response: Response) {
    const { userId, eventId } = request.params;
    await userEventService.delete(userId, eventId);
    response.status(200).send();
  },

  // Métodos adicionais específicos para UserEvent
  async findActiveParticipants(request: Request, response: Response) {
    const { eventId } = request.params;
    const data = await userEventService.findActiveByEvent(eventId);
    response.status(200).json(data);
  },

  async registerAllUsers(request: Request, response: Response) {
    const { eventId } = request.params;
    await userEventService.registerAllUsers(eventId);
    response.status(200).json({ message: 'Todos os usuários foram registrados' });
  },

  async closeRegistrations(request: Request, response: Response) {
    const { eventId } = request.params;
    await userEventService.closeRegistrations(eventId);
    response.status(200).json({ message: 'Inscrições encerradas' });
  }
};