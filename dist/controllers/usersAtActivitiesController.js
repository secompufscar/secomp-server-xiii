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
const usersAtActivitiesService_1 = __importDefault(require("../services/usersAtActivitiesService"));
exports.default = {
    findById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { activityId } = request.params;
            const data = yield usersAtActivitiesService_1.default.findManyByActivityId(activityId);
            response.status(200).json(data);
        });
    },
    findByUserId(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = request.params;
            const data = yield usersAtActivitiesService_1.default.findManyByUserId(userId);
            response.status(200).json(data);
        });
    },
    findByUserIdActivityId(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, activityId } = request.params;
            const data = yield usersAtActivitiesService_1.default.findUserAtActivity(userId, activityId);
            response.status(200).json(data);
        });
    },
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            // modifiquei pois estava dando varios problemas com o id, id undefined, etc
            const userId = request.user.id;
            if (!userId) {
                return response.status(401).json({ error: "Usuário não autenticado" });
            }
            const { activityId, presente, inscricaoPrevia, listaEspera } = request.body;
            const data = yield usersAtActivitiesService_1.default.create({
                userId,
                activityId,
                presente,
                inscricaoPrevia,
                listaEspera,
            });
            response.status(201).json(data);
        });
    },
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const data = yield usersAtActivitiesService_1.default.update(id, request.body);
            response.status(200).json(data);
        });
    },
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, activityId } = request.params;
            yield usersAtActivitiesService_1.default.delete(userId, activityId);
            response.status(200).send();
        });
    }
};
