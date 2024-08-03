"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = __importDefault(require("../controllers/usersController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const routes = (0, express_1.Router)();
routes.post('/signup', usersController_1.default.signup);
routes.post('/login', usersController_1.default.login);
routes.get('/getProfile', authMiddleware_1.authMiddleware, usersController_1.default.getProfile);
exports.default = routes;
