export class ApiError extends Error {
    public readonly statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

export enum ErrorsCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
}