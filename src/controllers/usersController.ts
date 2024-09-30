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
        const data = await usersService.confirmUser(request.params.token)

        if (data) {
            response.render('confirmationSuccess', { data })
        }
    },

    async sendForgotPasswordEmail(request: Request, response: Response) {
        const user = request.user as User
        await usersService.sendForgotPasswordEmail(user)

        response.status(200).json({ message: "Email enviado com sucesso" })
    },

    async updateForgottenPassword(request: Request, response: Response) {
        const data = await usersService.updatePassword(request.params.token)

        return response.status(200).json(data)
    }
}