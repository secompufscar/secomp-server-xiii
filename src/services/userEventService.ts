// services/userEventService.ts
import { UserEvent } from "../entities/UserEvent";
import userEventRepository from "../repositories/userEventRepository";
import eventRepository from "../repositories/eventRepository";
import userRepository from "../repositories/usersRepository";
import { ApiError, ErrorsCode } from "../utils/api-errors";
import {
  CreateUserEventDTOS,
  UpdateUserEventDTOS,
  UserEventDTOS,
} from "../dtos/userEventDtos";

export default {
    async findByEvent(eventId: string): Promise<UserEventDTOS[]> {
        return userEventRepository.findByEvent(eventId);
    },

    async findByUser(userId: string): Promise<UserEventDTOS[]> {
        return userEventRepository.findByUser(userId);
    },
    async findActiveByEvent(eventId: string): Promise<UserEventDTOS[]> {
        const allRegistrations = await this.findByEvent(eventId);
        return allRegistrations.filter((registration) => registration.status === 1);
    },

    async findByUserAndEvent(
        userId: string,
        eventId: string
    ): Promise<UserEventDTOS> {
        const registration = await userEventRepository.findByUserAndEvent(
            userId,
            eventId
        );
        if (!registration) {
            throw new Error("Inscrição não encontrada");
        }

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
            throw new Error(
                "Evento não encontrado, não é possível realizar a inscrição"
            );
        }

        const existingRegistration = await userEventRepository.findByUserAndEvent(
            userId,
            eventId
        );

        if (existingRegistration) {
            throw new Error("Usuário já está inscrito neste evento");
        }

        // 1. Criar o registro UserEvent
        const newUserEventEntry = await userEventRepository.create({
            userId,
            eventId,
            status: 1, // Status "inscrito"
        });

        // 2. Atualizar User.registrationStatus para 1 e User.currentEdition
        try {
            await userRepository.updateUserEventStatus(userId, 1, event.year);
        } catch (error) {
            throw new Error("Falha ao atualizar status do usuário");
        }

        return newUserEventEntry;
    },

    async update(
        id: string,
        { status }: UpdateUserEventDTOS
    ): Promise<UserEvent> {
        // 1. Verifica existência
        const existing = await userEventRepository.findById(id);
        if (!existing) throw new Error("Inscrição não encontrada");

        // 2. Valida transição de status
        if (status !== undefined) {
        if (existing.status === 2 && status !== 2) {
            throw new Error("Inscrições encerradas não podem ser reativadas");
        }
        }

        // 3. Atualiza apenas o status (único campo atualizável)
        return userEventRepository.update(id, {
            status: status ?? existing.status, // Mantém o atual se não fornecido
        });
    },
    async delete(userId: string, eventId: string): Promise<void> {
        const registration = await userEventRepository.findByUserAndEvent(
            userId,
            eventId
        );
        if (!registration) {
            throw new Error("Inscrição não encontrada");
        }

        await userEventRepository.delete(registration.id);

        // Atualiza próximo da lista de espera
        const nextInLine = await userEventRepository.findFirstWaitlist(eventId);
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
