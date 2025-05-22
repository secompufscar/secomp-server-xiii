import { Request, Response } from 'express';

import usersService from "../services/usersService"
import { User } from '@entities/User';

export default {
    async login(request: Request, response: Response) {
        const data = await usersService.login(request.body)
        response.status(200).json(data)
    },

    async signup(request: Request, response: Response)  {
        const data = await usersService.signup(request.body)

        response.status(200).json(data)
    },

    async getProfile(request: Request, response: Response)  {
        return response.json(request.user)
    },

    async confirmEmail(request: Request, response: Response) {
        try {
            const data = await usersService.confirmUser(request.params.token)

            if (data) {
                response.render('confirmationSuccess', { data })
            }
            else {
                response.render('confirmationError', { motivo: "Usuário não reconhecido" })
            }
        }
        catch {
            response.render('confirmationError', { motivo: "Erro interno"})
        }
    },

    async sendForgotPasswordEmail(request: Request, response: Response) {
        try {
            const { email} = request.body
            await usersService.sendForgotPasswordEmail(email)
            response.status(200).json({ message: "Email enviado com sucesso" })
        } 
        catch (error) {
            response.status(500).json({ message: "Erro ao enviar email" })
        }
    },

    async updateForgottenPassword(request: Request, response: Response) {
    try {
        const { token } = request.params; // Token vem da URL
        const { senha } = request.body;   // Nova senha vem do corpo

        const data = await usersService.updatePassword(token, senha);
        return response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ message: "Erro ao atualizar senha" });
    }
}
}