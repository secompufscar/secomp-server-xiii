import userEventRepository from "../repositories/userEventRepository";
import eventRepository from "../repositories/eventRepository";
import userRepository from "../repositories/usersRepository";
import { CreateUserEventDTOS, UpdateUserEventDTOS, UserEventDTOS } from "../dtos/userEventDtos";

export default {
  async findByEvent(eventId: string): Promise<UserEventDTOS[]> {
    const registrations = await userEventRepository.findByEvent(eventId);
    return registrations;
  },

  async findByUser(userId: string): Promise<UserEventDTOS[]> {
    const registrations = await userEventRepository.findByUser(userId);
    return registrations;
  },

  async findActiveByEvent(eventId: string): Promise<UserEventDTOS[]> {
    const allRegistrations = await this.findByEvent(eventId);
    return allRegistrations.filter((registration) => registration.status === 1);
  },

  async findByUserAndEvent(userId: string, eventId: string): Promise<UserEventDTOS | null> {
    const registration = await userEventRepository.findByUserAndEvent(userId, eventId);
    return registration;
  },

  async create(inputData: CreateUserEventDTOS): Promise<UserEventDTOS> {
    const { userId, eventId } = inputData;

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado, não é possível realizar a inscrição");
    }

    const existingRegistration = await userEventRepository.findByUserAndEvent(userId, eventId);
    if (existingRegistration) {
      throw new Error("Usuário já está inscrito neste evento");
    }

    const newUserEventEntry = await userEventRepository.create({
      userId,
      eventId,
      status: 1,
    });

    try {
      await userRepository.updateUserEventStatus(userId, 1, event.year);
    } catch (error) {
      throw new Error("Falha ao atualizar status do usuário");
    }

    return newUserEventEntry;
  },

  async update(id: string, { status }: UpdateUserEventDTOS): Promise<UserEventDTOS> { 
    const existing = await userEventRepository.findById(id);
    if (!existing) {
      throw new Error("Inscrição não encontrada");
    }

    if (status !== undefined) {
      if (existing.status === 2 && status !== 2) {
        throw new Error("Inscrições encerradas não podem ser reativadas");
      }
    }

    return userEventRepository.update(id, {
      status: status ?? existing.status,
    });
  },

  async delete(id: string, userId: string): Promise<void> {
    const registration = await userEventRepository.findByIdAndUser(id, userId);
    if (!registration) {
      throw new Error("Inscrição não encontrada ou não autorizada");
    }
    
    await userEventRepository.delete(id);
    
    const nextInLine = await userEventRepository.findFirstWaitlist(registration.eventId);
    if (nextInLine) {
      await userEventRepository.update(nextInLine.id, { status: 1 });
    }
  },

  async registerAllUsers(eventId: string): Promise<void> {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    await userEventRepository.createForAllUsers(eventId);
  },

  async closeRegistrations(eventId: string): Promise<void> {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado");
    }
    await userEventRepository.closeAllForEvent(eventId);
  },
};