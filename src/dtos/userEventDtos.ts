//dtos/userEventDtos    novo arquivo
import { UserEventStatus } from "../entities/UserEvent";
export interface CreateUserEventDTOS {
  userId: string;
  eventId: string;
  status: UserEventStatus;
}

export interface UpdateUserEventDTOS {
  status?: UserEventStatus;
}

export interface UserEventDTOS {
  id: string;
  userId: string;
  eventId: string;
  status: UserEventStatus;
  createdAt: Date;
}
