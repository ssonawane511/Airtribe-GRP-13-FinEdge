export class AppError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", data = null) {
      super(message)
  
      this.statusCode = statusCode
      this.code = code
      this.status = statusCode >= 500 ? "error" : "fail"
      this.data = data
  
      Error.captureStackTrace(this, this.constructor)
    }
  }