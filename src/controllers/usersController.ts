import { Request, Response } from 'express';

import usersService from "../services/usersService"
import { User } from '@entities/User';

export default {
    async login(request: Request, response: Response) {
        const data = await usersService.login(request.body)
        const { token, ...loggedUser } = data

        response.status(200).json(data)
    },

    async signup(request: Request, response: Response)  {
        try {
            const data = await usersService.signup(request.body)

            response.status(200).json(data)
        }
        catch(error: any) {
            response.status(error.statusCode).json({ message: error.message })
        }
    },

    async getProfile(request: Request, response: Response)  {
        return response.json(request.user)
    }
}