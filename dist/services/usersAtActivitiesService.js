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
const usersAtActivitiesRepository_1 = __importDefault(require("../repositories/usersAtActivitiesRepository"));
const activitiesRepository_1 = __importDefault(require("../repositories/activitiesRepository"));
const checkInRepository_1 = __importDefault(require("../repositories/checkInRepository"));
const usersRepository_1 = __importDefault(require("../repositories/usersRepository"));
exports.default = {
    findManyByActivityId(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersAtActivities = yield usersAtActivitiesRepository_1.default.findManyByActivityId(activityId);
            return usersAtActivities;
        });
    },
    findManyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersAtActivities = yield usersAtActivitiesRepository_1.default.findManyByUserId(userId);
            return usersAtActivities;
        });
    },
    findUserAtActivity(userId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAtActivity = yield checkInRepository_1.default.findUserAtActivity(userId, activityId);
            return userAtActivity;
        });
    },
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, activityId }) {
            const existingUserAtActivity = yield usersAtActivitiesRepository_1.default.findByUserIdAndActivityId(userId, activityId);
            if (existingUserAtActivity) {
                throw new Error('Usuário já está associado a esta atividade.');
            }
            const isFull = yield activitiesRepository_1.default.isActivityFull(activityId);
            const userAtActivity = yield usersAtActivitiesRepository_1.default.create({
                userId,
                activityId,
                presente: false,
                inscricaoPrevia: true,
                listaEspera: isFull
            });
            return userAtActivity;
        });
    },
    update(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { presente, inscricaoPrevia, listaEspera }) {
            const existingUserAtActivity = yield usersAtActivitiesRepository_1.default.findById(id);
            if (!existingUserAtActivity) {
                throw new Error('Registro não encontrado.');
            }
            if (presente === true && existingUserAtActivity.presente === false) {
                // Busca a atividade para saber quantos pontos ela vale.
                const activity = yield activitiesRepository_1.default.findById(existingUserAtActivity.activityId);
                // Verifica se a atividade concede pontos
                if (activity && activity.points && activity.points > 0) {
                    yield usersRepository_1.default.addPoints(existingUserAtActivity.userId, activity.points);
                }
            }
            const updatedUserAtActivity = yield usersAtActivitiesRepository_1.default.update(id, {
                presente: presente !== null && presente !== void 0 ? presente : existingUserAtActivity.presente,
                inscricaoPrevia: inscricaoPrevia !== null && inscricaoPrevia !== void 0 ? inscricaoPrevia : existingUserAtActivity.inscricaoPrevia,
                listaEspera: listaEspera !== null && listaEspera !== void 0 ? listaEspera : existingUserAtActivity.listaEspera,
            });
            return updatedUserAtActivity;
        });
    },
    delete(userId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAtActivity = yield checkInRepository_1.default.findUserAtActivity(userId, activityId);
            //const existingUserAtActivity = await usersAtActivitiesRepository.findById(id);
            if (!userAtActivity) {
                throw new Error('Registro não encontrado.');
            }
            // Deleta a inscrição do usuário
            yield usersAtActivitiesRepository_1.default.delete(userAtActivity.id);
            // Verifica se há usuários na lista de espera
            const nextInLine = yield usersAtActivitiesRepository_1.default.findFirstInWaitlist(userAtActivity.activityId);
            if (nextInLine) {
                // Atualiza o status do próximo na lista de espera para um participante ativo
                yield usersAtActivitiesRepository_1.default.update(nextInLine.id, {
                    listaEspera: false,
                    inscricaoPrevia: true,
                    presente: false
                });
            }
            return userAtActivity;
        });
    },
};
