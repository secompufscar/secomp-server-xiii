import { Request, Response } from 'express';

import usersService from "../services/usersService"

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
            const data = await usersService.confirmUser(request.params.token);
    
            if (data) {
                return response.redirect('/email-confirmado');
            } else {
                return response.redirect('/email-confirmado?erro=usuario-nao-reconhecido');
            }
        } catch {
            return response.redirect('/email-confirmado?erro=erro-interno');
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
},
    async getUserRanking(request: Request, response: Response){
        try{
            const ranking = await usersService.getUserRanking(request.params.id);
            response.status(200).json({rank:ranking});
        }
        catch(error){
            console.error('Erro usersController.ts: '+error);
            response.status(500).json({msg:'Erro ao consultar ranking do usuario'})
        }
    }
}