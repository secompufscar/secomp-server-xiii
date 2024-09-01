import { Request, Response, NextFunction } from "express";
import { BadRequestsException, UnauthorizedUserError, UserNotFoundError } from "../utils/exceptions";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { auth } from "../config/auth";
import * as jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-errors";

type jwtPayload = {
    userId: string
}

const prismaClient = new PrismaClient()
const JWT_SECRET = auth.secret_token

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers
        if(!authorization) {
            throw new UnauthorizedUserError("Não autorizado")
        }
        
        const token = authorization.split(' ')[1]
        const { userId } = jwt.verify(token, JWT_SECRET) as jwtPayload

        if(!userId) {
            throw new BadRequestsException("Bad request")
        }

        const user = await prismaClient.user.findFirst( { where: { id: userId } } )
        
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