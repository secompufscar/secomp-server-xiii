// src/repositories/usersRepository.ts
import { PrismaClient } from "@prisma/client";
import { User, RegistrationStatus } from "../entities/User"; 
import { CreateUserDTOS, UpdateQrCodeUsersDTOS, UpdateUserDTOS } from "../dtos/usersDtos";

const client = new PrismaClient();


export default {
    async list(): Promise<User[]> {
        const response = await client.user.findMany();
        
        // Mapeia a resposta e faz a asserção de tipo em cada item
        return response.map(user => ({
            ...user,
            registrationStatus: user.registrationStatus as RegistrationStatus 
        }));
    },

    async findById(id: string): Promise<User | null> {
        const response = await client.user.findFirst({
            where: { id }
        });

        if (!response) {
            return null;
        }
        // Faz a asserção de tipo antes de retornar
        return { ...response, registrationStatus: response.registrationStatus as RegistrationStatus };
    },
    
    async setRegistrationStatusForAllEligibleUsers(newStatus: number): Promise<void> {
        try {
            console.log(`[userRepository.setRegistrationStatusForAllEligibleUsers] Tentando atualizar registrationStatus para ${newStatus} para usuários elegíveis.`);
            const updateResult = await client.user.updateMany({
                where: {
                    registrationStatus: { not: newStatus } 
                },
                data: {
                    registrationStatus: newStatus
                }
            });
            console.log(`[userRepository.setRegistrationStatusForAllEligibleUsers] Status de registro atualizado para ${newStatus}. Usuários afetados: ${updateResult.count}`);
        } catch (error) {
            console.error(`[userRepository.setRegistrationStatusForAllEligibleUsers] Erro ao atualizar registrationStatus dos usuários elegíveis:`, error);
            throw error;
        }
    },
    async updateUserEventStatus(userId: string, registrationStatusInput: number, currentEdition: number): Promise<User> { // CORRIGIDO: Retorno é Promise<User>
        const response = await client.user.update({
            where: { id: userId },
            data: {
                registrationStatus: registrationStatusInput, // Prisma aceita number aqui para a escrita
                currentEdition: currentEdition.toString()
            }
        });

        return { ...response, registrationStatus: response.registrationStatus as RegistrationStatus };
    },
    async setRegistrationStatusForUsers(userIds: string[], newStatus: number): Promise<void> {
   
        if (userIds.length === 0) {
            return; 
        }
        await client.user.updateMany({
            where: {
                id: { in: userIds } 
            },
            data: {
                registrationStatus: newStatus 
            }
        });
    },

    async findByEmail(email: string): Promise<User | null> {
        const response = await client.user.findFirst({
            where: { email }
        });

        // Se não encontrar o usuário, retorna nulo.
        if (!response) {
            return null;
        }

        // Faz a asserção de tipo antes de retornar o usuário.
        return {
            ...response,
            registrationStatus: response.registrationStatus as RegistrationStatus
        };
    },


    async create(data: CreateUserDTOS): Promise<User> {
        const response = await client.user.create({ data });
        return { ...response, registrationStatus: response.registrationStatus as RegistrationStatus };
    },

    async update(id: string, data: UpdateUserDTOS): Promise<User> {
        const response = await client.user.update({
            data,
            where: { id }
        });
        return { ...response, registrationStatus: response.registrationStatus as RegistrationStatus };
    },

    async delete(id: string): Promise<void> {
        await client.user.delete({ where: { id } });
    },

    async updateQRCode(id: string, data: UpdateQrCodeUsersDTOS): Promise<User> { 
        const response = await client.user.update({
            data, // UpdateQrCodeUsersDTOS deve ser compatível com os campos que User.update aceita para 'data'
            where: { id }
        });
        // Faz a asserção de tipo
        return { ...response, registrationStatus: response.registrationStatus as RegistrationStatus };
    },
};