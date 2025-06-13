export type UserEventStatus = 0 | 1 | 2;
export interface UserEvent {
  id: string;
  userId: string;
  eventId: string;
  status:  UserEventStatus;// 0 | 1 | 2; // 0 = Cancelado, 1 = Inscrito, 2 = Fechado
  createdAt: Date;
}