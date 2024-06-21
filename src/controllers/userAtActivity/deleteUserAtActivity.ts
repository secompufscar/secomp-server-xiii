import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteUserAtActivity = async (req: Request, res: Response) => {
  const { activityId, id } = req.params;

  try {

    const existingUserAtActivity = await prisma.userAtActivity.findFirst({
      where: {
        id: id,
        activityId: activityId,
      },
    });

    if (!existingUserAtActivity) {
      return res.status(404).json({ message: 'Registro não encontrado.' });
    }

    await prisma.userAtActivity.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: 'Registro deletado com sucesso.', deletedUserAtActivity: existingUserAtActivity });
  } catch (error) {
    console.error('Erro ao deletar UserAtActivity:', error);
    res.status(500).json({ message: 'Erro ao deletar UserAtActivity', error });
  } 
};
