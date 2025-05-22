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
const usersService_1 = __importDefault(require("../services/usersService"));
exports.default = {
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield usersService_1.default.login(request.body);
            response.status(200).json(data);
        });
    },
    signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield usersService_1.default.signup(request.body);
            response.status(200).json(data);
        });
    },
    getProfile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return response.json(request.user);
        });
    },
    confirmEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield usersService_1.default.confirmUser(request.params.token);
                if (data) {
                    response.render('confirmationSuccess', { data });
                }
                else {
                    response.render('confirmationError', { motivo: "Usuário não reconhecido" });
                }
            }
            catch (_a) {
                response.render('confirmationError', { motivo: "Erro interno" });
            }
        });
    },
    sendForgotPasswordEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = request.body;
                yield usersService_1.default.sendForgotPasswordEmail(email);
                response.status(200).json({ message: "Email enviado com sucesso" });
            }
            catch (error) {
                response.status(500).json({ message: "Erro ao enviar email" });
            }
        });
    },
    updateForgottenPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = request.params; // Token vem da URL
                const { senha } = request.body; // Nova senha vem do corpo
                const data = yield usersService_1.default.updatePassword(token, senha);
                return response.status(200).json(data);
            }
            catch (error) {
                response.status(500).json({ message: "Erro ao atualizar senha" });
            }
        });
    }
};
