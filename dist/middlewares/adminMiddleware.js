"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
const exceptions_1 = require("../utils/exceptions");
// import { PrismaClient } from "@prisma/client"; 
const auth_1 = require("../config/auth");
const jwt = __importStar(require("jsonwebtoken"));
const api_errors_1 = require("../utils/api-errors");
const usersRepository_1 = __importDefault(require("../repositories/usersRepository")); // Importamos o repositório.
// const prismaClient = new PrismaClient(); 
const JWT_SECRET = auth_1.auth.secret_token;
function adminMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                throw new exceptions_1.UnauthorizedUserError("Não autorizado");
            }
            const token = authorization.split(' ')[1];
            const { userId } = jwt.verify(token, JWT_SECRET);
            if (!userId) {
                throw new exceptions_1.BadRequestsException("Bad request");
            }
            // Usamos o repositório para buscar o usuário.
            const user = yield usersRepository_1.default.findById(userId);
            // Adicionado um check para caso o usuário não tenha sido encontrado no banco
            if (!user) {
                throw new exceptions_1.UserNotFoundError("Usuário associado ao token não encontrado.");
            }
            // A verificação continua a mesma, mas agora sobre um objeto com tipo seguro.
            if (user.tipo !== "ADMIN") {
                throw new exceptions_1.UnauthorizedUserError("Acesso restrito a administradores.");
            }
            // Se o usuário é admin, a requisição continua.
            next();
        }
        catch (error) {
            if (error instanceof api_errors_1.ApiError)
                return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            else if (error instanceof jwt.TokenExpiredError)
                return res.status(401).json({ message: "Token expirado", statusCode: 401 });
            console.error("Erro em acesso administrativo: ", error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    });
}
