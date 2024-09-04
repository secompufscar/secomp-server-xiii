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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const exceptions_1 = require("../utils/exceptions");
const client_1 = require("@prisma/client");
const auth_1 = require("../config/auth");
const jwt = __importStar(require("jsonwebtoken"));
const api_errors_1 = require("../utils/api-errors");
const prismaClient = new client_1.PrismaClient();
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
            const user = yield prismaClient.user.findFirst({ where: { id: userId } });
            if ((user === null || user === void 0 ? void 0 : user.tipo) !== "ADMIN") {
                throw new exceptions_1.UnauthorizedUserError("Não autorizado");
            }
            next();
        }
        catch (error) {
            if (error instanceof api_errors_1.ApiError)
                res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            else if (error instanceof jwt.TokenExpiredError)
                res.status(401).json({ message: "Token expirado", statusCode: 401 });
            console.error("Erro em acesso: ", error.message);
        }
    });
}
exports.adminMiddleware = adminMiddleware;
