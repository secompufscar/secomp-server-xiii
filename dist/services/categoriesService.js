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
const categoriesRepository_1 = __importDefault(require("../repositories/categoriesRepository"));
const activitiesRepository_1 = __importDefault(require("../repositories/activitiesRepository"));
exports.default = {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoriesRepository_1.default.findById(id);
            if (!category) {
                throw new Error('Categoria não encontrada');
            }
            return category;
        });
    },
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoriesRepository_1.default.list();
            return categories;
        });
    },
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nome }) {
            const category = yield categoriesRepository_1.default.create({
                nome
            });
            return category;
        });
    },
    update(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nome }) {
            const updatedCategory = yield categoriesRepository_1.default.update(id, {
                nome
            });
            return updatedCategory;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingActivities = yield activitiesRepository_1.default.findManyByCategoryId(id);
            if (existingActivities == null) {
                throw new Error('Esta categoria não pode ser excluída porque ainda existem atividades vinculadas a ela.');
            }
            const deletedCategory = yield categoriesRepository_1.default.delete(id);
            return deletedCategory;
        });
    }
};
