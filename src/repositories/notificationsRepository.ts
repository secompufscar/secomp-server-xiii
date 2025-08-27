import { Prisma } from '@prisma/client';
import { prisma } from "../lib/prisma";
import { CreateNotificationDTO } from "../dtos/notificationsDtos";
import { Notification } from "../entities/Notification";

export default {
  async create(data: CreateNotificationDTO): Promise<Notification> {
    return prisma.notificationHistory.create({
      data: {
        title: data.title,
        message: data.message,
        data: data.data as Prisma.InputJsonValue, 
        status: 'PENDING',
        createdBy: data.createdBy || null, 
        recipients: {
          connect: data.recipientIds.map(id => ({ id }))
        }
      },
      include: {
        sender: true,
        recipients: true
      }
    }) as unknown as Notification; 
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