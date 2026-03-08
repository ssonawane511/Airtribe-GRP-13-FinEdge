class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

class InternalServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ConflictError,
    InternalServerError,
};
