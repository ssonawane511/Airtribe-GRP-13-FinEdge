const { UnauthorizedError } = require('../utils/errors');

const requireUser = (req, res, next) => {
    if (!req.user?.userId) {
        return next(new UnauthorizedError('Invalid token payload. Please login again.'));
    }
    return next();
};

module.exports = requireUser;
