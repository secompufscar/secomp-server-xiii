export type UserEventStatus = 0 | 1 | 2; // 0 = Cancelado, 1 = Inscrito, 2 = Fechado
export interface UserEvent {
  id: string;
  userId: string;
  eventId: string;
  status: UserEventStatus; 
  createdAt: Date;
}
