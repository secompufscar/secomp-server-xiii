import { Request, Response } from "express";
import { JWT_SECRET } from "../../secrets";
import { BadRequestsException, NoJWTSecretSpecifiedError } from "../../exceptions/exceptions";
import { prismaClient } from "../..";
import { hashSync } from "bcrypt";

export const updateUser = async (req: Request, res: Response) => {
    const { email, updatedEmail, nome, senha, tipo } = req.body
    const { authorization } = req.headers
    console.log(authorization)

    try {
        if(!JWT_SECRET)
            throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")

        let user = await prismaClient.user.findUnique({ where: {email} })

        if(!user)
            throw new BadRequestsException("Email não existe")

        user = await prismaClient.user.update( {
            where: {email},
            data: {
                email: updatedEmail ?? updatedEmail,
                nome: nome ?? nome,
                senha: senha ?? hashSync(senha, 10)
            }
        } )

        res.status(201).json(user)
    }
    catch(error: any) {
        console.log("Erro em update de usuário: ", error.message)
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
    }
}