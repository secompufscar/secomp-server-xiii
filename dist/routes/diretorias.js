"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const diretoriasController_1 = __importDefault(require("../controllers/diretoriasController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const routes = (0, express_1.Router)();
routes.get('/', authMiddleware_1.authMiddleware, diretoriasController_1.default.list);
routes.get('/:id', authMiddleware_1.authMiddleware, diretoriasController_1.default.findById);
routes.post('/', authMiddleware_1.authMiddleware, diretoriasController_1.default.create);
routes.put('/:id', authMiddleware_1.authMiddleware, diretoriasController_1.default.update);
routes.delete('/:id', authMiddleware_1.authMiddleware, diretoriasController_1.default.delete);
exports.default = routes;
