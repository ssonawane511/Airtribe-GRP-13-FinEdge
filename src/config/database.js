import mongoose from 'mongoose';
import logger from '../shared/logger/index.js';
import { InternalServerError } from '../shared/errors/errors.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        throw new InternalServerError(`MongoDB connection error: ${error.message}`);
    }
}

export default connectDB;
