import eventRepository from "../repositories/eventRepository";
import userEventRepository from "../repositories/userEventRepository";
import userRepository from "../repositories/usersRepository";
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
    const events = await eventRepository.list();
    return events;
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
    const currentEvent = await eventRepository.findCurrent();
    return currentEvent;
  },

  async create(data: CreateEventDTOS): Promise<EventDTOS> {
    const newEvent = await eventRepository.create(data);

    try {
      await userRepository.setRegistrationStatusForAllEligibleUsers(0);
    } catch (error) {
      console.error(
        `[eventService.create] Erro ao tentar atualizar registrationStatus dos usuários para 0:`,
        error
      );
    }

    return newEvent;
  },

  async update(id: string, data: UpdateEventDTOS): Promise<EventDTOS> {
    const existingEvent = await eventRepository.findById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }

    const updatedEvent = await eventRepository.update(id, data);
    return updatedEvent;
  },

  async deactivate(id: string): Promise<EventDTOS> {
    const existingEvent = await eventRepository.findById(id);
    if (!existingEvent) {
      throw new Error("Evento não encontrado");
    }

    await userEventRepository.updateAllUsersToStatus(id, 2);
    const deactivatedEvent = await eventRepository.deactivate(id);

    return deactivatedEvent;
  },

  async delete(eventId: string): Promise<void> {
    try {
      await userRepository.setRegistrationStatusForAllEligibleUsers(2);
      await userEventRepository.updateAllUsersToStatus(eventId, 2);
      await eventRepository.delete(eventId);
    } catch (error) {
      console.error(
        `[eventService.delete] Erro crítico ao tentar deletar o evento ${eventId} e suas associações/efeitos colaterais:`,
        error
      );
      throw error;
    }
  },
};