import { Request, Response } from 'express';

import categoriesService from "../services/categoriesService"

export default {
    async findById(request: Request, response: Response) {
      const { id } = request.params;

      const data = await categoriesService.findById(id)
  
      response.status(200).json(data)
    },

    async list(request: Request, response: Response) {
      const data = await categoriesService.list()
        
      response.status(200).json(data)
    },

    async create(request: Request, response: Response) {
      const data = await categoriesService.create(request.body)

      response.status(201).json(data)
    },

    async update(request: Request, response: Response) {
      const { id } = request.params;

      const data = await categoriesService.update(id, request.body)
  
      response.status(200).json(data)
    },

    async delete(request: Request, response: Response) {
      const { id } = request.params;

      await categoriesService.delete(id)
  
      response.status(200).send()
    }
}