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
const categoriesService_1 = __importDefault(require("../services/categoriesService"));
exports.default = {
    findById(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const data = yield categoriesService_1.default.findById(id);
            response.status(200).json(data);
        });
    },
    list(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const activities = yield categoriesService_1.default.list();
            return activities;
        });
    },
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield categoriesService_1.default.create(request.body);
            response.status(201).json(data);
        });
    },
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const data = yield categoriesService_1.default.update(id, request.body);
            response.status(200).json(data);
        });
    },
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            yield categoriesService_1.default.delete(id);
            response.status(200).send();
        });
    }
};
