"use strict";
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
const bcrypt_1 = require("bcrypt");
const auth_1 = require("../config/auth");
const exceptions_1 = require("../utils/exceptions");
const adminServices_1 = __importDefault(require("../services/adminServices"));
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, nome, tipo } = req.body;
            const { authorization } = req.headers;
            const JWT_SECRET = auth_1.auth.secret_token;
            try {
                if (!JWT_SECRET)
                    throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
                if (!authorization)
                    throw new exceptions_1.BadRequestsException("Acesso negado");
                if (tipo !== "USER" && tipo !== "ADMIN")
                    throw new exceptions_1.BadRequestsException("Tipo de usuário não reconhecido");
                let user = yield adminServices_1.default.findByEmail(email);
                if (user) {
                    throw new exceptions_1.BadRequestsException("Email já cadastrado");
                }
                yield adminServices_1.default.create({ nome, email, senha: (0, bcrypt_1.hashSync)(senha, 10), tipo });
                user = yield adminServices_1.default.findByEmail(email);
                res.status(201).json(user);
            }
            catch (error) {
                console.error("Erro criando usuário: ", error.message);
                res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email, nome, senha, tipo } = req.body;
            const { authorization } = req.headers;
            const JWT_SECRET = auth_1.auth.secret_token;
            try {
                if (!JWT_SECRET)
                    throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
                if (!authorization)
                    throw new exceptions_1.BadRequestsException("Acesso negado");
                let user = yield adminServices_1.default.findById(id);
                if (!user) {
                    throw new exceptions_1.UserNotFoundError("Usuário não encontrado");
                }
                yield adminServices_1.default.update(id, { nome, email, senha, tipo });
                user = yield adminServices_1.default.findById(id);
                res.status(201).json(user);
            }
            catch (error) {
                console.log("Erro em update de usuário: ", error.message);
                res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const JWT_SECRET = auth_1.auth.secret_token;
            try {
                if (!JWT_SECRET)
                    throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
                let user = yield adminServices_1.default.findById(id);
                if (!user)
                    throw new exceptions_1.BadRequestsException("ID de usuário não existe");
                yield adminServices_1.default.delete(user.id ? user.id : "");
                res.status(201).json(user);
            }
            catch (error) {
                console.log("Erro deletando usuário: ", error.message);
                res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
        });
    }
};
