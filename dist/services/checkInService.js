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
const usersRepository_1 = __importDefault(require("../repositories/usersRepository"));
const activitiesRepository_1 = __importDefault(require("../repositories/activitiesRepository"));
exports.default = {
    checkIn(userId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAtActivity = yield checkInRepository_1.default.findUserAtActivity(userId, activityId);
            console.log(userAtActivity);
            if (!userAtActivity) {
                console.log(userAtActivity);
                throw new Error('Usuário não está cadastrado na atividade.');
            }
            const activity = yield activitiesRepository_1.default.findById(activityId);
            if (!activity) {
                throw new Error("Atividade não encontrada.");
            }
            const pointsToAdd = activity.points; // Acessa o novo campo 'points' da Activity
            // Adicionar pontos ao usuário
            yield usersRepository_1.default.addPoints(userId, pointsToAdd);
            // Marcar como presente
            return yield checkInRepository_1.default.markAsPresent(userAtActivity.id);
        });
    },
};
