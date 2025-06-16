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
                    return response.redirect('/email-confirmado');
                }
                else {
                    return response.redirect('/email-confirmado?erro=usuario-nao-reconhecido');
                }
            }
            catch (_a) {
                return response.redirect('/email-confirmado?erro=erro-interno');
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
    },
    // Método para registrar o token de push
    registerPushToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { token } = req.body;
            if (typeof userId !== 'string') {
                return res.status(400).json({ success: false, message: "User ID is required and must be a string" });
            }
            if (typeof token !== 'string') {
                return res.status(400).json({ success: false, message: "Token is required and must be a string" });
            }
            yield usersService_1.default.addPushToken(userId, token);
            res.status(200).json({ success: true });
        });
    }
};
