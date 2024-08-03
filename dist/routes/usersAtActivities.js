"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersAtActivitiesController_1 = __importDefault(require("../controllers/usersAtActivitiesController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const routes = (0, express_1.Router)();
routes.get('/:activityId', authMiddleware_1.authMiddleware, usersAtActivitiesController_1.default.findById);
routes.get('/all-activities/:userId', authMiddleware_1.authMiddleware, usersAtActivitiesController_1.default.findByUserId);
routes.post('/', authMiddleware_1.authMiddleware, usersAtActivitiesController_1.default.create);
routes.put('/:activityId/:id', authMiddleware_1.authMiddleware, usersAtActivitiesController_1.default.update);
routes.delete('/:activityId/:id', authMiddleware_1.authMiddleware, usersAtActivitiesController_1.default.delete);
exports.default = routes;
