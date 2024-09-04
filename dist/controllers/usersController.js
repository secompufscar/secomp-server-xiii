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
            const data = yield usersService_1.default.confirmUser(request.params.token);
            response.status(200).json(data);
        });
    },
    sendForgotPasswordEmail(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = request.user;
            yield usersService_1.default.sendForgotPasswordEmail(user);
            response.status(200).json({ message: "Email enviado com sucesso" });
        });
    },
    updateForgottenPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield usersService_1.default.updatePassword(request.params.token);
            return response.status(200).json(data);
        });
    }
};
