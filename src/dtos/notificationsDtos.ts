export interface CreateNotificationDTO {
  title: string;
  message: string;
  recipientIds: string[];
  data?: Record<string, unknown>; 
  sound?: boolean;
  badge?: number;
  createdBy?: string;
}

export interface UpdateNotificationDTO {
  id: string;
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  sound?: boolean;
  badge?: number;
  status?: 'PENDING' | 'SENT' | 'FAILED';
  error?: string;
  updatedBy?: string;
}