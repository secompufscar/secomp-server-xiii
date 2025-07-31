import { JsonValue } from '@prisma/client/runtime/library'; 
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateNotificationDTO, UpdateNotificationDTO } from "../dtos/notificationsDtos";
import { Notification } from "../entities/Notification";

const prisma = new PrismaClient();

export default {
  async create(data: CreateNotificationDTO): Promise<Notification> {
    return prisma.notificationHistory.create({
      data: {
        title: data.title,
        message: data.message,
        data: data.data as Prisma.InputJsonValue, // Converta para JsonValue
        status: 'PENDING',
        createdBy: data.createdBy || null, // Trate undefined como null
        recipients: {
          connect: data.recipientIds.map(id => ({ id }))
        }
      },
      include: {
        sender: true,
        recipients: true
      }
    }) as unknown as Notification; // Forçar tipagem
  },

  async findById(id: string): Promise<Notification | null> {
    return prisma.notificationHistory.findUnique({
      where: { id },
      include: {
        sender: true,
        recipients: true
      }
    }) as unknown as Notification | null;
  },

  async findManyByIds(ids: string[]): Promise<Notification[]> {
    return prisma.notificationHistory.findMany({
      where: { id: { in: ids } },
      include: {
        sender: true,
        recipients: true
      }
    }) as unknown as Notification[];
  },

  async findByUserId(userId: string): Promise<Notification[]> {
    return prisma.notificationHistory.findMany({
      where: {
        recipients: {
          some: { id: userId }
        }
      },
      include: {
        sender: true,
        recipients: true
      }
    }) as unknown as Notification[];
  },
};