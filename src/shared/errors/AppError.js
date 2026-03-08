export class AppError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
      super(message)
  
      this.statusCode = statusCode
      this.code = code
      this.status = statusCode >= 500 ? "error" : "fail"
  
      Error.captureStackTrace(this, this.constructor)
    }
  }