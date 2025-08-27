import { User } from './User';
import { Prisma } from '@prisma/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  data?: Prisma.InputJsonValue; 
  status: 'PENDING' | 'SENT' | 'FAILED';
  error?: string;
  sentAt: Date;
  createdBy?: string;
  sender?: User;
  recipients: User[];
}