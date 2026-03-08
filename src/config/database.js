import mongoose from 'mongoose';
import logger from '../shared/logger/index.js';
import { NotFoundError } from '../shared/errors/errors.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        throw new NotFoundError(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
