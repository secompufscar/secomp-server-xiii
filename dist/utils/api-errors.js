"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsCode = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
var ErrorsCode;
(function (ErrorsCode) {
    ErrorsCode[ErrorsCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorsCode[ErrorsCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorsCode[ErrorsCode["NOT_FOUND"] = 404] = "NOT_FOUND";
})(ErrorsCode || (exports.ErrorsCode = ErrorsCode = {}));
