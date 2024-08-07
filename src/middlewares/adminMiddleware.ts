import { Request, Response, NextFunction } from "express";
import { UnauthorizedUserError } from "../utils/exceptions";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken"
import { ApiError } from "../utils/api-errors";
import adminServices from "../services/adminServices";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers
        if(!authorization) {
            throw new UnauthorizedUserError("Não autorizado")
        }
        
        const tipo = req.user.tipo
        console.log(`tipo: ${tipo}`)
        if(tipo !== "ADMIN") {
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