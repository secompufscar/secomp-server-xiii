"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoJWTSecretSpecifiedError = exports.UnauthorizedUserError = exports.IncorrectPasswordError = exports.UserNotFoundError = exports.BadRequestsException = void 0;
const api_errors_1 = require("./api-errors");
class BadRequestsException extends api_errors_1.ApiError {
    constructor(message) {
        super(message, api_errors_1.ErrorsCode.BAD_REQUEST);
    }
}
exports.BadRequestsException = BadRequestsException;
class UserNotFoundError extends api_errors_1.ApiError {
    constructor(message) {
        super(message, api_errors_1.ErrorsCode.NOT_FOUND);
    }
}
exports.UserNotFoundError = UserNotFoundError;
class IncorrectPasswordError extends api_errors_1.ApiError {
    constructor(message) {
        super(message, api_errors_1.ErrorsCode.UNAUTHORIZED);
    }
}
exports.IncorrectPasswordError = IncorrectPasswordError;
class UnauthorizedUserError extends api_errors_1.ApiError {
    constructor(message) {
        super(message, api_errors_1.ErrorsCode.UNAUTHORIZED);
    }
}
exports.UnauthorizedUserError = UnauthorizedUserError;
class NoJWTSecretSpecifiedError extends api_errors_1.ApiError {
    constructor(message) {
        super(message, api_errors_1.ErrorsCode.UNAUTHORIZED);
    }
}
exports.NoJWTSecretSpecifiedError = NoJWTSecretSpecifiedError;
