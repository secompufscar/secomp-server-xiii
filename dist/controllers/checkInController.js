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
const checkInService_1 = __importDefault(require("../services/checkInService"));
const checkInRepository_1 = __importDefault(require("../repositories/checkInRepository"));
exports.default = {
    checkIn(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, activityId } = request.params;
            console.log(userId, activityId);
            const data = yield checkInService_1.default.checkIn(userId, activityId);
            response.status(200).json(data);
        });
    },
    listParticipants(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { activityId } = request.params;
            const participants = yield checkInRepository_1.default.findParticipantsByActivity(activityId);
            response.status(200).json(participants);
        });
    }
};
