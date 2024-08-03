"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkInController_1 = __importDefault(require("../controllers/checkInController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/:userId/:activityId', authMiddleware_1.authMiddleware, checkInController_1.default.checkIn);
router.get('/participants/:activityId', authMiddleware_1.authMiddleware, checkInController_1.default.listParticipants);
exports.default = router;
