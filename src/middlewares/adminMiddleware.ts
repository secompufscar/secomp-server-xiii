import { Request, Response, NextFunction } from "express";
import { UnauthorizedUserError } from "../utils/exceptions";
import { User } from "@prisma/client";
import { prismaClient } from "..";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-errors";

type jwtPayload = {
    id: number
}

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers
        if(!authorization) {
            throw new UnauthorizedUserError("Não autorizado")
        }
        
        const token = authorization.split(' ')[1]
        const { id } = jwt.verify(token, JWT_SECRET) as jwtPayload
        const user = await prismaClient.user.findFirst( { where: { id } } )
        
        console.log(user)
        if(user?.tipo !== "ADMIN") {
            throw new UnauthorizedUserError("Não autorizado")
        }
        next()
    }
    catch(error: any) {
        if(error instanceof ApiError)
            res.status(error.statusCode).json( { message: error.message, statusCode: error.statusCode } )
        else if(error instanceof jwt.TokenExpiredError)
            res.status(401).json( { message: "Token expirado", statusCode: 401 } )
        console.error("Erro em acesso: ", error.message)
    }
}