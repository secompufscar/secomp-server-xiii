import { Request, Response, NextFunction } from "express";
import { UnauthorizedUserError } from "../utils/exceptions";
import { PrismaClient } from "@prisma/client";
import { auth } from "../config/auth"
import usersService from "../services/usersService";
import * as jwt from "jsonwebtoken"


type jwtPayload = {
    userId: string
}

export const prismaClient = new PrismaClient();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const JWT_SECRET = auth.secret_token

    
    
    try {
        if(!authorization) 
            throw new UnauthorizedUserError("Não autorizado")

        const token = authorization.split(' ')[1]
        const { userId } = jwt.verify(token, JWT_SECRET) as jwtPayload 
        const user = await usersService.findById(userId)
        
        const { ...loggedUser } = user
        req.user = loggedUser
        next();
    }
    catch(error: any) {
        throw new UnauthorizedUserError("Token inválido")
    }
}