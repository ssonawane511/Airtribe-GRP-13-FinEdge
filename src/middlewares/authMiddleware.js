const jwt = require('jsonwebtoken');
const {
    UnauthorizedError,
    InternalServerError,
} = require('../utils/errors');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!JWT_SECRET) {
        return next(new InternalServerError('JWT_SECRET is not configured'));
    }

    if (!authHeader) {
        return next(new UnauthorizedError('Authorization token missing'));
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(new UnauthorizedError('Invalid authorization format'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new UnauthorizedError('Token expired'));
        }
        return next(new UnauthorizedError('Invalid token'));
    }
};

module.exports = authenticateToken;
