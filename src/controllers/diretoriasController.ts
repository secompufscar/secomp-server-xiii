import { Request, Response } from 'express';

import diretoriasService from "../services/diretoriasService"

export default {
  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const data = await diretoriasService.findById(id)

    response.status(200).json(data)
  },

  async list(request: Request, response: Response) {
    const data = await diretoriasService.list()

    response.status(200).json(data)
  },

  async create(request: Request, response: Response) {
    const data = await diretoriasService.create(request.body)

    response.status(201).json(data)
  },

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const data = await diretoriasService.update(request.body)

    response.status(200).json(data)
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await diretoriasService.delete(id)

    response.status(200).send()
  }
}