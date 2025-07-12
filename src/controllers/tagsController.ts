import { Request, Response } from 'express';
import tagsService from "../services/tagsService";

export default {
  async list(request: Request, response: Response) {
    const tags = await tagsService.listAll();
    return response.status(200).json(tags);
  },

  async create(request: Request, response: Response) {
    const newTag = await tagsService.create(request.body);
    return response.status(201).json(newTag);
  },
   async update(request: Request, response: Response) {
    const { id } = request.params;
    const updatedTag = await tagsService.update(id, request.body);
    return response.json(updatedTag);
  },

  // NOVO MÉTODO
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await tagsService.delete(id);
    return response.status(204).send(); // Resposta de sucesso sem conteúdo
  },
};