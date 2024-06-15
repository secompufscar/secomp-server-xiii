import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateUserAtActivity = async (req: Request, res: Response) => {
  const { activityId, id } = req.params;
  const { presente, inscricaoPrevia, listaEspera } = req.body;

  try {

    const existingUserAtActivity = await prisma.userAtActivity.findUnique({
      where: {
        id: id,
        activityId: activityId,
      },
    });

    if (!existingUserAtActivity) {
      return res.status(404).json({ message: 'Registro não encontrado.' });
    }

    const updatedUserAtActivity = await prisma.userAtActivity.update({
      where: {
        id: id,
      },
      data: {
        presente: presente ?? existingUserAtActivity.presente,
        inscricaoPrevia: inscricaoPrevia ?? existingUserAtActivity.inscricaoPrevia,
        listaEspera: listaEspera ?? existingUserAtActivity.listaEspera,
      },
    });

    res.status(200).json(updatedUserAtActivity);
  } catch (error) {
    console.error('Erro ao atualizar UserAtActivity:', error);
    res.status(500).json({ message: 'Erro ao atualizar UserAtActivity', error });
  } 
};
