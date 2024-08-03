"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
exports.auth = {
    secret_token: process.env.JWT_SECRET,
    expires_in_token: process.env.EXPIRES_IN_TOKEN
};
