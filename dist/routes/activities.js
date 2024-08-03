"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activitiesController_1 = __importDefault(require("../controllers/activitiesController"));
const activitySchema_1 = require("../schemas/activitySchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validate_1 = __importDefault(require("../middlewares/validate"));
const routes = (0, express_1.Router)();
routes.get('/', authMiddleware_1.authMiddleware, activitiesController_1.default.list);
routes.get('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, activitySchema_1.activityIdSchema), activitiesController_1.default.findById);
routes.post('/', authMiddleware_1.authMiddleware, (0, validate_1.default)(activitySchema_1.createActivitySchema), activitiesController_1.default.create);
routes.put('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(activitySchema_1.updateActivitySchema, activitySchema_1.activityIdSchema), activitiesController_1.default.update);
routes.delete('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, activitySchema_1.activityIdSchema), activitiesController_1.default.delete);
exports.default = routes;
