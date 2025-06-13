// src/controllers/eventController.ts
import { Request, Response } from 'express';
import eventService from '../services/eventService';

export default {
  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const data = await eventService.findById(id);

    response.status(200).json(data);
  },

  async list(request: Request, response: Response) {
    const data = await eventService.list();

    response.status(200).json(data);
  },

  async findCurrent(request: Request, response: Response) {
    const data = await eventService.findCurrent();

    response.status(200).json(data);
  },

  async create(request: Request, response: Response) {
    const data = await eventService.create(request.body);

    response.status(201).json(data);
  },

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const data = await eventService.update(id, request.body);

    response.status(200).json(data);
  },

  async deactivate(request: Request, response: Response) {
    const { id } = request.params;

    const data = await eventService.deactivate(id);

    response.status(200).json(data);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await eventService.delete(id);

    response.status(200).send();
  }
};