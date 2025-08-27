import { prisma } from "../lib/prisma";
import { CreateEventDTOS, UpdateEventDTOS, EventDTOS } from "../dtos/eventDtos";

export default {
  async list(): Promise<EventDTOS[]> {
    const response = await prisma.event.findMany({
      orderBy: { startDate: "desc" },
    });
    return response;
  },

  async findById(id: string): Promise<EventDTOS | null> {
    const response = await prisma.event.findUnique({
      where: { id },
    });
    return response;
  },

  async findCurrent(): Promise<EventDTOS | null> {
    const response = await prisma.event.findFirst({
      where: { isCurrent: true },
    });
    return response;
  },

  async create(data: CreateEventDTOS): Promise<EventDTOS> {
    const response = await prisma.event.create({ data });
    return response;
  },

  async update(id: string, data: UpdateEventDTOS): Promise<EventDTOS> {
    const response = await prisma.event.update({
      where: { id },
      data,
    });
    return response;
  },

  async deactivate(id: string): Promise<EventDTOS> {
    const response = await prisma.event.update({
      where: { id },
      data: { endDate: new Date() },
    });
    return response;
  },

  async delete(id: string): Promise<void> {
    await prisma.event.delete({
      where: { id },
    });
  },
};