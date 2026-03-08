export const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500

    const response = {
        success: false,
        message: err.message || "Internal Server Error",
        error: {
            code: err.code || "INTERNAL_ERROR"
        }
    }

    res.status(statusCode).json(response)
    return;
}