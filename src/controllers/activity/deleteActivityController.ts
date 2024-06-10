import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { activityIdSchema } from '../../schemas/activitySchema';


const prisma = new PrismaClient();

export const deleteAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    activityIdSchema.parse({ id });
    
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