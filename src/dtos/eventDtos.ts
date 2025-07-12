// src/dtos/eventDtos.ts

export interface CreateEventDTOS {
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface UpdateEventDTOS {
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface EventDTOS {
  id: string;
  year: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  isCurrent: boolean;
}
