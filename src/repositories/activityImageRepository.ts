import { prisma } from "../lib/prisma";
import { CreateActivityImageDTOS, UpdateActivityImageDTOS, ActivityImageDTOS } from "../dtos/activityImageDtos";

export default {
  async create(data: CreateActivityImageDTOS): Promise<CreateActivityImageDTOS> {
    const response = await prisma.activityImage.create({ data });
    return response;
  },

  async list(): Promise<ActivityImageDTOS[]> {
    const response = await prisma.activityImage.findMany();
    return response;
  },

  async update(id: string, data: UpdateActivityImageDTOS): Promise<UpdateActivityImageDTOS> {
    const response = await prisma.activityImage.update({
      where: { id },
      data,
    });
    return response;
  },

  async findByActivityId(activityId: string): Promise<ActivityImageDTOS[]> {
    const response = await prisma.activityImage.findMany({
      where: {
        activityId,
      },
    });
    return response;
  },

  async findById(id: string): Promise<ActivityImageDTOS | null> {
    const response = await prisma.activityImage.findUnique({
      where: { id },
    });
    return response;
  },

  async deleteById(id: string): Promise<void> {
    await prisma.activityImage.delete({
      where: { id },
    });
  },
};