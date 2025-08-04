import { PrismaClient } from "@prisma/client";
import { ActivityImage } from "../entities/ActivityImage";
import { CreateActivityImageDTOS, UpdateActivityImageDTOS, ActivityImageDTOS } from "../dtos/activityImageDtos";

const client = new PrismaClient();

export default {
  async create(data: CreateActivityImageDTOS): Promise<CreateActivityImageDTOS> {
    const response = await client.activityImage.create({
      data,
    });
    return response;
  },

  async list(): Promise<ActivityImageDTOS[]> {
    const response = await client.activityImage.findMany();
    return response;
  },

  async update(data: UpdateActivityImageDTOS, id: string): Promise<UpdateActivityImageDTOS> {
    const response = await client.activityImage.update({
      data,
      where: {
        id: id,
      },
    });
    return response;
  },

  async findByActivityId(activityId: string): Promise<ActivityImageDTOS[]> {
    const response = await client.activityImage.findMany({
      where: {
        activityId: {
          equals: activityId,
        },
      },
    });
    return response;
  },

  async findById(id: string): Promise<ActivityImageDTOS | null> {
    const response = await client.activityImage.findUnique({
      where: {
        id: id,
      },
    });
    return response;
  },
	
  async deleteById(id: string): Promise<void> {
    await client.activityImage.delete({
      where: {
        id: id,
      },
    });
  },
};
