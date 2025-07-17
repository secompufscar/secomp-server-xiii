import { ApiError, ErrorsCode } from "./api-errors";

export class BadRequestsException extends ApiError {
  constructor(message: string) {
    super(message, ErrorsCode.BAD_REQUEST);
  }
}

export class UserNotFoundError extends ApiError {
  constructor(message: string) {
    super(message, ErrorsCode.NOT_FOUND);
  }
}

export class IncorrectPasswordError extends ApiError {
  constructor(message: string) {
    super(message, ErrorsCode.UNAUTHORIZED);
  }
}

export class UnauthorizedUserError extends ApiError {
  constructor(message: string) {
    super(message, ErrorsCode.UNAUTHORIZED);
  }
}

export class NoJWTSecretSpecifiedError extends ApiError {
  constructor(message: string) {
    super(message, ErrorsCode.UNAUTHORIZED);
  }
}
