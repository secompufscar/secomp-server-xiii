"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const routes = (0, express_1.Router)();
routes.use(adminMiddleware_1.adminMiddleware);
routes.post('/create', adminController_1.default.create);
routes.put('/edit', adminController_1.default.update);
routes.delete('/delete', adminController_1.default.delete);
exports.default = routes;
