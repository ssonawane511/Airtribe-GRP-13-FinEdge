const { AppError } = require('../utils/errors');

const errorMiddleware = (error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message || 'Internal server error' });
};

module.exports = errorMiddleware;
