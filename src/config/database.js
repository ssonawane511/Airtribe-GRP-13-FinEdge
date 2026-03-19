import mongoose from "mongoose";

import { InternalServerError } from "../shared/errors/errors.js";
import logger from "../shared/logger/index.js";

let memoryServer;

const getMongoUri = async () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (process.env.NODE_ENV === "test") {
    if (!memoryServer) {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create();
    }
    return memoryServer.getUri();
  }

  throw new InternalServerError("MONGODB_URI is not configured");
};

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const mongoUri = await getMongoUri();
    const db = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${db.connection.host}`);
    return db;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw new InternalServerError(`MongoDB connection error: ${error.message}`);
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

export default connectDB;
