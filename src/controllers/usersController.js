const usersModel = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
    InternalServerError,
} = require('../utils/errors');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = Number(process.env.MIN_PASSWORD_LENGTH) || 8;
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const registerUser = async (user) => {
    if (!user?.name || !user?.email || !user?.password) {
        throw new BadRequestError('Name, email, and password are required');
    }

    if (!EMAIL_REGEX.test(String(user.email).trim())) {
        throw new BadRequestError('Invalid email format');
    }

    if (typeof user.password !== 'string' || user.password.length < MIN_PASSWORD_LENGTH) {
        throw new BadRequestError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }

    user.email = String(user.email).trim().toLowerCase();
    user.password = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS);
    try {
        const dbUser = await usersModel.create(user);
        return {
            id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
        };
    } catch (error) {
        if (error?.code === 11000) {
            throw new ConflictError('Email already exists');
        }
        if (error?.name === 'ValidationError') {
            throw new BadRequestError(error.message);
        }
        throw error;
    }
};


const loginUser = async ({email, password}) => {
    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }

    if (!EMAIL_REGEX.test(String(email).trim())) {
        throw new BadRequestError('Invalid email format');
    }
    
    const body = {
        email: String(email).trim().toLowerCase()
    };

    const dbUser = await usersModel.findOne(body);

    if (!dbUser) {
        throw new UnauthorizedError('Invalid email or password');
    }

    const isSamePassword = await bcrypt.compare(password, dbUser.password)
    
    if (!isSamePassword) {
        throw new UnauthorizedError('Invalid email or password');
    }

    if (!JWT_SECRET) {
        throw new InternalServerError('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
        { userId: dbUser._id, username: dbUser.name, email: dbUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return { token };
};

module.exports = {
    registerUser, 
    loginUser
};
