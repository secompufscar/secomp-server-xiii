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
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const secrets_1 = require("../../secrets");
const exceptions_1 = require("../../exceptions/exceptions");
exports.default = {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, nome, tipo } = req.body;
            const { authorization } = req.headers;
            console.log("BRUH: ", authorization);
            console.log(secrets_1.JWT_SECRET);
            try {
                if (!secrets_1.JWT_SECRET)
                    throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
                if (tipo !== "USER" && tipo !== "ADMIN")
                    throw new exceptions_1.BadRequestsException("Tipo de usuário não reconhecido");
                let user = yield prismaClient.user.findFirst({ where: { email } });
                if (user) {
                    throw new exceptions_1.BadRequestsException("Email já cadastrado");
                }
                user = yield prismaClient.user.create({
                    data: {
                        email,
                        senha: (0, bcrypt_1.hashSync)(senha, 10),
                        nome,
                        tipo
                    }
                });
                res.status(201).json(user);
            }
            catch (error) {
                console.error("Erro criando usuário: ", error.message);
                res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode });
            }
        });
    },
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, updatedEmail, nome, senha, tipo } = req.body;
            const { authorization } = req.headers;
            console.log(authorization);
            try {
                if (!secrets_1.JWT_SECRET)
                    throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
                let user = yield prismaClient.user.findUnique({ where: { email } });
                if (!user)
                    throw new exceptions_1.BadRequestsException("Email não existe");
                user = yield prismaClient.user.update({
                    where: { email },
                    data: {
                        email: updatedEmail !== null && updatedEmail !== void 0 ? updatedEmail : updatedEmail,
                        nome: nome !== null && nome !== void 0 ? nome : nome,
                        senha: senha !== null && senha !== void 0 ? senha : (0, bcrypt_1.hashSync)(senha, 10)
                    }
                });
                res.status(201).json(user);
            }
            catch (error) {
                console.log("Erro em update de usuário: ", error.message);
                res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
        });
    },
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                if (!secrets_1.JWT_SECRET)
                    throw new exceptions_1.NoJWTSecretSpecifiedError("Chava JWT não especificada");
                let user = yield prismaClient.user.findFirst({ where: { email } });
                if (!user)
                    throw new exceptions_1.BadRequestsException("Email não existe");
                user = yield prismaClient.user.delete({ where: email });
                res.status(201).json(user);
            }
            catch (error) {
                console.log("Erro deletando usuário: ", error.message);
                res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
            }
        });
    }
};
