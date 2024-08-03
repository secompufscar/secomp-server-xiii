import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTOS, UpdateUserDTOS, UserDTOS } from '../dtos/usersDtos';
import usersRepository from '../repositories/usersRepository';

export default {
    async findById(id: string): Promise<UserDTOS | null> {
        const user = await usersRepository.findById(id)

        return user
    },

    async findByEmail(email: string): Promise<UserDTOS | null> {
        const user = await usersRepository.findByEmail(email)

        return user
    },

    async list(): Promise<UserDTOS[]> {
        return await usersRepository.list()
    },

    async create({ nome, email, senha, tipo }: CreateUserDTOS): Promise<CreateUserDTOS> {
        const user = await usersRepository.create( {
            nome,
            email,
            senha,
            tipo
        } )

        return user
    },

    async update(id: string, { nome, email, senha, tipo }: UpdateUserDTOS): Promise<UpdateUserDTOS> {
        const user = await usersRepository.update(id, { nome, email, senha, tipo })

        return user
    },

    async delete(id: string): Promise<void> {
        const user = await usersRepository.delete(id)

        return user
    }
}