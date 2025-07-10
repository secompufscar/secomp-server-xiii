import { Request, Response } from 'express';
import sponsorsService from "../services/sponsorService";

export default {
  async list(request: Request, response: Response) {
    const sponsors = await sponsorsService.listAll();
    return response.status(200).json(sponsors);
  },
  async create(request: Request, response: Response) {
    const newSponsor = await sponsorsService.create(request.body);
    return response.status(201).json(newSponsor);
  },

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const updatedSponsor = await sponsorsService.update(id, request.body);
    return response.json(updatedSponsor);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    await sponsorsService.delete(id);
    return response.status(204).send();
  },
};