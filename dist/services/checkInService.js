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
const checkInRepository_1 = __importDefault(require("../repositories/checkInRepository"));
const eventService_1 = __importDefault(require("./eventService"));
exports.default = {
    checkIn(userId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAtActivity = yield checkInRepository_1.default.findUserAtActivity(userId, activityId);
            if (!userAtActivity) {
                throw new Error('Usuário não está cadastrado na atividade.');
            }
            // verifica se usuário esta inscrito no evento (nova verificação)
            const registration = yield eventService_1.default.getUserRegistration(userId);
            if (!registration || registration.status !== 1) {
                throw new Error("Usuário não está inscrito neste evento");
            }
            // Marcar como presente
            return yield checkInRepository_1.default.markAsPresent(userAtActivity.id);
        });
    },
};
