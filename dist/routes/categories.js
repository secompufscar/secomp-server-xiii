"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesController_1 = __importDefault(require("../controllers/categoriesController"));
const categorySchema_1 = require("../schemas/categorySchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validate_1 = __importDefault(require("../middlewares/validate"));
const routes = (0, express_1.Router)();
routes.get('/', authMiddleware_1.authMiddleware, categoriesController_1.default.list);
routes.get('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, categorySchema_1.categoryIdSchema), categoriesController_1.default.findById);
routes.post('/', authMiddleware_1.authMiddleware, (0, validate_1.default)(categorySchema_1.createCategorySchema), categoriesController_1.default.create);
routes.put('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(categorySchema_1.updateCategorySchema, categorySchema_1.categoryIdSchema), categoriesController_1.default.update);
routes.delete('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, categorySchema_1.categoryIdSchema), categoriesController_1.default.delete);
exports.default = routes;
