import { PrismaClient } from "@prisma/client";
import { UserAtActivity } from "../entities/UserAtActivity";

const client = new PrismaClient();

export default {
  async findUserAtActivity(userId: string, activityId: string): Promise<UserAtActivity | null> {
    return await client.userAtActivity.findFirst({
      where: {
        userId,
        activityId,
      },
    });
  },

  async markAsPresent(userAtActivityId: string): Promise<UserAtActivity> {
    return await client.userAtActivity.update({
      where: { id: userAtActivityId },
      data: { presente: true },
    });
  },
  // async createWaitlistEntry(userId: string, activityId: string): Promise<UserAtActivity> {
  //     return await client.userAtActivity.create({
  //         data: {
  //             userId,
  //             activityId,
  //             inscricaoPrevia: false,
  //             listaEspera: true,
  //             presente: false
  //         }
  //     });
  // },

  async findParticipantsByActivity(activityId: string): Promise<UserAtActivity[]> {
    return await client.userAtActivity.findMany({
      where: {
        activityId,
      },
      include: {
        user: true,
      },
    });
  },
};
