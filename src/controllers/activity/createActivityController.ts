import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createActivitySchema } from '../../schemas/activitySchema';


const prisma = new PrismaClient();

export const createAtividade = async (req: Request, res: Response) => {
  const { nome, data, palestranteNome, categoriaId, vagas, detalhes } = req.body;

  try {

    createActivitySchema.parse(req.body);

    const newData = data ? new Date(data) : null;

    const newAtividade = await prisma.activity.create({
      data: {
        nome,
        data: newData, 
        palestranteNome,
        categoriaId,
        vagas,
        detalhes,
      },
    });
    res.status(201).json(newAtividade);
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({ message: 'Erro ao criar atividade' });
  }
};


export default {
  createAtividade,

};