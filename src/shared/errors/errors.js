import { AppError } from "./AppError.js"

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400, "BAD_REQUEST")
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED")
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404, "NOT_FOUND")
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT")
  }
}

export default {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError
}