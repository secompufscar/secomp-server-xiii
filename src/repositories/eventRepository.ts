// src/repositories/eventRepository.ts

import { PrismaClient } from "@prisma/client";
import { Event } from "../entities/Event";
import { CreateEventDTOS, UpdateEventDTOS, EventDTOS } from "../dtos/eventDtos";

const client = new PrismaClient();

export default {
  async list(): Promise<EventDTOS[]> {
    const response = await client.event.findMany({
      orderBy: { startDate: "desc" },
    });
    return response;
  },

  async findById(id: string): Promise<EventDTOS | null> {
    const response = await client.event.findUnique({
      where: { id },
    });
    return response;
  },

  async findCurrent(): Promise<EventDTOS | null> {
    const response = await client.event.findFirst({
      where: { isCurrent: true },
    });
    return response;
  },

  async create(data: CreateEventDTOS): Promise<EventDTOS> {
    const response = await client.event.create({ data });
    return response;
  },

  async update(id: string, data: UpdateEventDTOS): Promise<EventDTOS> {
    const response = await client.event.update({
      where: { id },
      data,
    });
    return response;
  },

  async deactivate(id: string): Promise<EventDTOS> {
    const response = await client.event.update({
      where: { id },
      data: { endDate: new Date() },
    });
    return response;
  },

  async delete(id: string): Promise<void> {
    await client.event.delete({
      where: { id },
    });
  },
};
