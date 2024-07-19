import { Request, Response } from 'express';

import activitiesService from "../services/activitiesService"

export default {
  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const data = await activitiesService.findById(id)

    response.status(200).json(data)
  },

  async list(request: Request, response: Response) {
    const data = await activitiesService.list()

    response.status(200).json(data)
  },

  async create(request: Request, response: Response) {
    const data = await activitiesService.create(request.body)

    response.status(201).json(data)
  },

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const data = await activitiesService.update(request.body)

    response.status(200).json(data)
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await activitiesService.delete(id)

    response.status(200).send()
  }
}