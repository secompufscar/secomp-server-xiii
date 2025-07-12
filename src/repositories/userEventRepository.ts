// src/repositories/userEventRepository.ts
import { PrismaClient } from "@prisma/client";
import { CreateUserEventDTOS, UpdateUserEventDTOS, UserEventDTOS } from "../dtos/userEventDtos";

const client = new PrismaClient();

// Definindo um tipo seguro para reutilização
type UserEventStatus = 0 | 1 | 2;

export default {
  async list(): Promise<UserEventDTOS[]> {
    const response = await client.userEvent.findMany();
    // Mapeia e faz a asserção de tipo
    return response.map((ue) => ({ ...ue, status: ue.status as UserEventStatus }));
  },

  async findById(id: string): Promise<UserEventDTOS | null> {
    const response = await client.userEvent.findUnique({ where: { id } });
    if (!response) return null;
    return { ...response, status: response.status as UserEventStatus };
  },

  async getUserRegistration(userId: string, eventId: string): Promise<UserEventDTOS | null> {
    console.log(
      `[userEventRepository.getUserRegistration] Recebido - userId: ${userId}, eventId: ${eventId}`,
    );
    const response = await client.userEvent.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!response) return null;
    return { ...response, status: response.status as UserEventStatus };
  },

  async findByUserAndEvent(userId: string, eventId: string): Promise<UserEventDTOS | null> {
    const response = await client.userEvent.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!response) return null;
    return { ...response, status: response.status as UserEventStatus };
  },

  async findByUser(userId: string): Promise<UserEventDTOS[]> {
    const response = await client.userEvent.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { event: { startDate: "desc" } },
    });
    return response.map((ue) => ({ ...ue, status: ue.status as UserEventStatus }));
  },

  async findByEvent(eventId: string): Promise<UserEventDTOS[]> {
    const response = await client.userEvent.findMany({
      where: { eventId },
      include: { user: true },
    });
    return response.map((ue) => ({ ...ue, status: ue.status as UserEventStatus }));
  },

  async findActiveByEvent(eventId: string): Promise<UserEventDTOS[]> {
    const response = await client.userEvent.findMany({
      where: { eventId, status: 1, user: { registrationStatus: 1 } },
      include: { user: true },
    });
    return response.map((ue) => ({ ...ue, status: ue.status as UserEventStatus }));
  },

  async findFirstWaitlist(eventId: string): Promise<UserEventDTOS | null> {
    const response = await client.userEvent.findFirst({
      where: { eventId, status: 0 },
      orderBy: { createdAt: "asc" },
    });
    if (!response) return null;
    return { ...response, status: response.status as UserEventStatus };
  },

  async create(data: CreateUserEventDTOS): Promise<UserEventDTOS> {
    const response = await client.userEvent.create({ data });
    return { ...response, status: response.status as UserEventStatus };
  },

  async update(id: string, data: UpdateUserEventDTOS): Promise<UserEventDTOS> {
    const response = await client.userEvent.update({
      where: { id },
      data,
    });
    return { ...response, status: response.status as UserEventStatus };
  },

  async updateStatusForUsers(userIds: string[], eventId: string, status: number): Promise<void> {
    await client.userEvent.updateMany({
      where: { userId: { in: userIds }, eventId },
      data: { status },
    });
  },
  async delete(id: string): Promise<void> {
    await client.userEvent.delete({ where: { id } });
  },
  async createForAllUsers(eventId: string): Promise<void> {},
  async closeAllForEvent(eventId: string): Promise<void> {
    await client.userEvent.updateMany({ where: { eventId }, data: { status: 2 } });
  },
  async updateAllUsersToStatus(eventId: string, status: number): Promise<void> {
    await client.userEvent.updateMany({ where: { eventId }, data: { status } });
  },
};
