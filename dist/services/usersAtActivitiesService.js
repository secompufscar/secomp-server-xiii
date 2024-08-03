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
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, activityId, presente, inscricaoPrevia, listaEspera }) {
            const existingUserAtActivity = yield usersAtActivitiesRepository_1.default.findByUserIdAndActivityId(userId, activityId);
            if (existingUserAtActivity) {
                throw new Error('Usuário já está associado a esta atividade.');
            }
            const userAtActivity = yield usersAtActivitiesRepository_1.default.create({
                userId,
                activityId,
                presente,
                inscricaoPrevia,
                listaEspera
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
            const updatedUserAtActivity = yield usersAtActivitiesRepository_1.default.update(id, {
                presente: presente !== null && presente !== void 0 ? presente : existingUserAtActivity.presente,
                inscricaoPrevia: inscricaoPrevia !== null && inscricaoPrevia !== void 0 ? inscricaoPrevia : existingUserAtActivity.inscricaoPrevia,
                listaEspera: listaEspera !== null && listaEspera !== void 0 ? listaEspera : existingUserAtActivity.listaEspera,
            });
            return updatedUserAtActivity;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUserAtActivity = yield usersAtActivitiesRepository_1.default.findById(id);
            if (!existingUserAtActivity) {
                throw new Error('Registro não encontrado.');
            }
            yield usersAtActivitiesRepository_1.default.delete(id);
        });
    }
};
