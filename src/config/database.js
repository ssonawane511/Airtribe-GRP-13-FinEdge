import mongoose from "mongoose";

import { InternalServerError } from "../shared/errors/errors.js";
import logger from "../shared/logger/index.js";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new InternalServerError("MONGODB_URI is not configured");
    }

    const db = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${db.connection.host}`);
    return db;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw new InternalServerError(`MongoDB connection error: ${error.message}`);
  }
};

export default connectDB;
