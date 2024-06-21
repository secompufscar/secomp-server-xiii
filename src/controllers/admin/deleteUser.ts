import { Request, Response } from "express";
import { prismaClient } from "../..";
import { BadRequestsException, NoJWTSecretSpecifiedError } from "../../exceptions/exceptions";
import { JWT_SECRET } from "../../secrets";

export const deleteUserByEmail = async (req: Request, res: Response) => {
    const { email } = req.body

    try {
        if(!JWT_SECRET)
            throw new NoJWTSecretSpecifiedError("Chava JWT não especificada")

        let user = await prismaClient.user.findFirst({ where: { email } })

        if(!user)
            throw new BadRequestsException("Email não existe")

        user = await prismaClient.user.delete({ where: email })

        res.status(201).json(user)
    }
    catch(error: any) {
        console.log("Erro deletando usuário: ", error.message)
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
    }
}