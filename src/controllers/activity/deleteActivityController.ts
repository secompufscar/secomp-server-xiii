import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { activityIdSchema } from '../../schemas/activitySchema';


const prisma = new PrismaClient();

export const deleteAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    activityIdSchema.parse({ id });

    const userAtActivities = await prisma.userAtActivity.findMany({
      where: {
        activityId: id,
      },
    });

    if (userAtActivities.length > 0) {
      return res.status(400).json({ message: 'Não é possível excluir esta atividade pois já possui associações de usuários.' });
    }
    
    const deletedAtividade = await prisma.activity.delete({
      where: { id },
    });
    res.json(deletedAtividade);
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);
    res.status(500).json({ message: 'Erro ao excluir atividade' });
  }
};



export default {
  deleteAtividade,
 
};