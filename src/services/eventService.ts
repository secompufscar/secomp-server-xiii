// services/eventService.ts
import eventRepository from "../repositories/eventRepository";
import userEventRepository from "../repositories/userEventRepository";
import userRepository from "../repositories/usersRepository";
import { Event } from "../entities/Event";
import { ApiError, ErrorsCode } from "../utils/api-errors";
import { CreateEventDTOS, UpdateEventDTOS, EventDTOS } from "../dtos/eventDtos";

export default {
  async findById(id: string): Promise<EventDTOS> {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    return event;
  },

  async list(): Promise<EventDTOS[]> {
    return eventRepository.list();
  },
  async getUserRegistration(userId: string) {
    const currentEvent = await this.findCurrent();
    if (!currentEvent) {
      throw new Error("Nenhum evento ativo no momento.");
    }
    const registration = await userEventRepository.findByUserAndEvent(userId, currentEvent.id);
    return registration;
  },

  async findCurrent(): Promise<EventDTOS | null> {
    return eventRepository.findCurrent();
  },

  async create(data: CreateEventDTOS): Promise<EventDTOS> {
    // 1. Cria o novo evento
    const newEvent = await eventRepository.create(data);
    try {
      await userRepository.setRegistrationStatusForAllEligibleUsers(0);
    } catch (error) {
      console.error(
        `[eventService.create] Erro ao tentar atualizar registrationStatus dos usuários para 0:`,
        error,
      );
    }

    return newEvent;
  },
  async update(id: string, data: UpdateEventDTOS): Promise<EventDTOS> {
    const existingEvent = await eventRepository.findById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }
    return eventRepository.update(id, data);
  },

  async deactivate(id: string): Promise<EventDTOS> {
    const existingEvent = await eventRepository.findById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }
    await userEventRepository.updateAllUsersToStatus(id, 2);
    return eventRepository.deactivate(id);
  },

  async delete(eventId: string): Promise<void> {
    try {
      await userRepository.setRegistrationStatusForAllEligibleUsers(2);

      await userEventRepository.updateAllUsersToStatus(eventId, 2);

      await eventRepository.delete(eventId);
    } catch (error) {
      console.error(
        `[eventService.delete] Erro crítico ao tentar deletar o evento ${eventId} e suas associações/efeitos colaterais:`,
        error,
      );
      throw error;
    }
  },
};
