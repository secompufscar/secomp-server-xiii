import userEventRepository from "../repositories/userEventRepository";
import eventRepository from "../repositories/eventRepository";
import userRepository from "../repositories/usersRepository";
import { CreateUserEventDTOS, UpdateUserEventDTOS, UserEventDTOS } from "../dtos/userEventDtos";
import { ApiError, ErrorsCode } from "../utils/api-errors";

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
      throw new ApiError("user was not found by this id", ErrorsCode.NOT_FOUND);
    }

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError("event was not found by this id", ErrorsCode.NOT_FOUND);
    }

    const existingRegistration = await userEventRepository.findByUserAndEvent(userId, eventId);
    if (existingRegistration) {
      throw new ApiError("user is already in this activity", ErrorsCode.BAD_REQUEST);
    }

    const newUserEventEntry = await userEventRepository.create({
      userId,
      eventId,
      status: 1,
    });

    try {
      await userRepository.updateUserEventStatus(userId, 1, event.year);
    } catch (error) {
      throw new ApiError("falha ao atualizar o status do usuário", ErrorsCode.INTERNAL_ERROR);
    }

    return newUserEventEntry;
  },

  async update(id: string, { status }: UpdateUserEventDTOS): Promise<UserEventDTOS> {
    const existing = await userEventRepository.findById(id);
    if (!existing) {
      throw new ApiError("inscricao nao encontrada", ErrorsCode.NOT_FOUND);
    }

    if (status !== undefined) {
      if (existing.status === 2 && status !== 2) {
        throw new ApiError("inscricoes encerradas nao podem ser reativadas", ErrorsCode.CONFLICT);
      }
    }

    return userEventRepository.update(id, {
      status: status ?? existing.status,
    });
  },

  async delete(id: string, userId: string): Promise<void> {
    const registration = await userEventRepository.findByIdAndUser(id, userId);
    if (!registration) {
      throw new ApiError("inscricao nao encontrada com este id e userId", ErrorsCode.NOT_FOUND);
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
      throw new ApiError("event not found by this id", ErrorsCode.NOT_FOUND);
    }
    await userEventRepository.createForAllUsers(eventId);
  },

  async closeRegistrations(eventId: string): Promise<void> {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError("event was not found by this id", ErrorsCode.NOT_FOUND);
    }
    await userEventRepository.closeAllForEvent(eventId);
  },
};
