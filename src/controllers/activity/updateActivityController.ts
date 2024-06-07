import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { updateActivitySchema, activityIdSchema } from '../../schemas/activitySchema';


const prisma = new PrismaClient();


export const updateAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, data, palestranteNome, categoriaId } = req.body;

  try {
    activityIdSchema.parse({ id });
    updateActivitySchema.parse(req.body);
    // Encontra a atividade existente
    const existingAtividade = await prisma.activity.findUnique({
      where: { id },
    });

    if (!existingAtividade) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    const updatedData: Record<string, any> = {};
    if (nome !== undefined) updatedData.nome = nome;
    if (data !== undefined) updatedData.data = new Date(data);
    if (palestranteNome !== undefined) updatedData.palestranteNome = palestranteNome;
    if (categoriaId !== undefined) updatedData.categoriaId = categoriaId;

    const updatedAtividade = await prisma.activity.update({
      where: { id },
      data: updatedData,
    });

    res.json(updatedAtividade);
  } catch (error) {
    console.log('erro', error)
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).json({ message: 'Erro ao atualizar atividade' });
  }
};

export default {
  updateAtividade,
};